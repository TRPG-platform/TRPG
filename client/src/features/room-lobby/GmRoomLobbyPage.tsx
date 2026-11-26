import { useCallback, useEffect, useState } from 'react';
import { getRoomLobby, type RoomLobbyState } from '../../data/roomLobby';
import LobbyNotice from './components/LobbyNotice';
import PlayerList from './components/PlayerList';
import ReadyStatusBar from './components/ReadyStatusBar';
import RoomLobbyHeader from './components/RoomLobbyHeader';
import RoomLobbyLayout from './components/RoomLobbyLayout';
import ScriptInfoPanel from './components/ScriptInfoPanel';
import GameSettingsPanel from './gm/GameSettingsPanel';
import GmToolsPanel from './gm/GmToolsPanel';
import { getLobbyStats } from './lobbyStats';
import './GmRoomLobbyPage.css';

// GM 房間大廳（room-lobby，設計稿 p1_TV-06.png）。
// 目前只用本地假資料，設定與開始跑團都只改本地狀態，不送到伺服器。
// TODO(room-lobby 3.1、3.2)：改接 API 與即時事件。
// TODO(#5)：Router 合併後新增 routes.tsx，從網址取 roomCode。

type RoomSettings = RoomLobbyState['room']['settings'];

interface GmRoomLobbyPageProps {
  roomCode: string;
}

export default function GmRoomLobbyPage({ roomCode }: GmRoomLobbyPageProps) {
  const [lobby, setLobby] = useState<RoomLobbyState | null>(null);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getRoomLobby(roomCode, controller.signal)
      .then(setLobby)
      .catch(() => {
        if (!controller.signal.aborted) setHasLoadError(true);
      });
    return () => controller.abort();
  }, [roomCode]);

  const dismissNotice = useCallback(() => setNotice(null), []);

  if (hasLoadError) {
    return <p className="gm-lobby-page__message">讀取房間資料失敗，請重新整理再試一次。</p>;
  }
  if (!lobby) {
    return (
      <p className="gm-lobby-page__message" role="status">
        讀取房間資料中…
      </p>
    );
  }

  const { room, script } = lobby;
  const { gm, players, sortedMembers, readyCount, canStart } = getLobbyStats(room);
  const isStarted = room.status === 'playing';

  function updateRoom(patch: Partial<RoomLobbyState['room']>) {
    setLobby((current) => current && { ...current, room: { ...current.room, ...patch } });
  }

  function changeSetting(key: keyof RoomSettings, value: boolean) {
    updateRoom({ settings: { ...room.settings, [key]: value } });
  }

  function startGame() {
    updateRoom({ status: 'playing' });
    setNotice('已開始跑團（目前是假資料，尚未連到遊戲房間）');
  }

  let statusMessage = '等待所有玩家準備';
  if (isStarted) statusMessage = '跑團已開始';
  else if (canStart) statusMessage = '等待GM開始遊戲';

  return (
    <>
      <RoomLobbyLayout
        scriptInfo={
          <ScriptInfoPanel
            script={script}
            ruleName={lobby.ruleName}
            playStyle={lobby.playStyle}
            ruleSystem={room.ruleSystem}
            gmName={gm?.displayName ?? '—'}
            playerCount={players.length}
            maxPlayers={room.maxPlayers}
            scheduledAt={room.scheduledAt}
          />
        }
        header={<RoomLobbyHeader roomCode={room.roomCode} />}
        players={
          <PlayerList
            members={sortedMembers}
            gmId={room.gmId}
            playerCount={players.length}
            maxPlayers={room.maxPlayers}
          />
        }
        main={
          <GameSettingsPanel
            ruleSystem={room.ruleSystem}
            settings={room.settings}
            onRuleSystemChange={(ruleSystem) => updateRoom({ ruleSystem })}
            onSettingChange={changeSetting}
          />
        }
        aside={
          <GmToolsPanel
            canStart={canStart}
            isStarted={isStarted}
            onUnavailable={(feature) => setNotice(`「${feature}」尚未開放`)}
            onStart={startGame}
          />
        }
        footer={
          <ReadyStatusBar
            readyCount={readyCount}
            playerCount={players.length}
            message={statusMessage}
          />
        }
      />
      <LobbyNotice message={notice} onDismiss={dismissNotice} />
    </>
  );
}
