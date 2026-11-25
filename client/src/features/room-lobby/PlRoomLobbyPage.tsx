import { useCallback, useEffect, useState } from 'react';
import {
  getMyLobbyCharacters,
  getRoomLobby,
  type LobbyCharacter,
  type LobbyMember,
  type RoomLobbyState,
} from '../../data/roomLobby';
import AnnouncementPanel from './components/AnnouncementPanel';
import LobbyNotice from './components/LobbyNotice';
import PlayerList from './components/PlayerList';
import ReadyStatusBar from './components/ReadyStatusBar';
import RoomLobbyHeader from './components/RoomLobbyHeader';
import RoomLobbyLayout from './components/RoomLobbyLayout';
import ScriptInfoPanel from './components/ScriptInfoPanel';
import { getLobbyStats } from './lobbyStats';
import CharacterLibraryList from './pl/CharacterLibraryList';
import CharacterPickerPanel, { type CharacterTab } from './pl/CharacterPickerPanel';
import CharacterSummaryCard from './pl/CharacterSummaryCard';
import ReadyButton from './pl/ReadyButton';
import './PlRoomLobbyPage.css';

// PL 房間大廳（room-lobby，設計稿 p1_TV-05.png）。
// 目前只用本地假資料，選角色和準備都只改本地狀態，不送到伺服器。
// TODO(room-lobby 3.1、3.2)：改接 API 與即時事件（member.character、member.ready）。
// TODO(#5)：Router 合併後新增 routes.tsx。方向：GM 和 PL 共用 /rooms/:roomCode，
// 依目前使用者是不是 GM 決定顯示 GmRoomLobbyPage 或 PlRoomLobbyPage。

interface PlRoomLobbyPageProps {
  roomCode: string;
}

export default function PlRoomLobbyPage({ roomCode }: PlRoomLobbyPageProps) {
  const [lobby, setLobby] = useState<RoomLobbyState | null>(null);
  const [characters, setCharacters] = useState<LobbyCharacter[]>([]);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [activeTab, setActiveTab] = useState<CharacterTab>('mine');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getRoomLobby(roomCode, controller.signal, 'pl'),
      getMyLobbyCharacters(controller.signal),
    ])
      .then(([lobbyState, myCharacters]) => {
        setLobby(lobbyState);
        setCharacters(myCharacters);
      })
      .catch(() => {
        if (!controller.signal.aborted) setHasLoadError(true);
      });
    return () => controller.abort();
  }, [roomCode]);

  const dismissNotice = useCallback(() => setNotice(null), []);

  if (hasLoadError) {
    return <p className="pl-lobby-page__message">讀取房間資料失敗，請重新整理再試一次。</p>;
  }
  if (!lobby) {
    return (
      <p className="pl-lobby-page__message" role="status">
        讀取房間資料中…
      </p>
    );
  }

  const { room, script } = lobby;
  const { gm, players, sortedMembers, readyCount, canStart } = getLobbyStats(room);
  const me = room.members.find((member) => member.userId === lobby.currentUserId);
  const myCharacter = characters.find((character) => character.id === me?.characterId) ?? null;

  function updateMe(patch: Partial<LobbyMember>) {
    setLobby(
      (current) =>
        current && {
          ...current,
          room: {
            ...current.room,
            members: current.room.members.map((member) =>
              member.userId === current.currentUserId ? { ...member, ...patch } : member,
            ),
          },
        },
    );
  }

  function chooseCharacter(characterId: string) {
    // 換角色會重置準備狀態（room-lobby「Ready state」）
    if (characterId !== me?.characterId) updateMe({ characterId, isReady: false });
    setActiveTab('mine');
  }

  function showUnavailable(feature: string) {
    setNotice(`「${feature}」尚未開放`);
  }

  let statusMessage = '等待所有玩家準備';
  if (room.status === 'playing') statusMessage = '跑團已開始';
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
          <CharacterPickerPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCreateCharacter={() => showUnavailable('建立新角色')}
          >
            {activeTab === 'library' ? (
              <CharacterLibraryList
                characters={characters}
                selectedId={me?.characterId ?? null}
                isExistingDisallowed={room.settings.disallowExistingCharacters}
                onSelect={chooseCharacter}
              />
            ) : myCharacter ? (
              <CharacterSummaryCard character={myCharacter} />
            ) : (
              <div className="pl-lobby-page__empty">
                <p>還沒有選擇本次使用的角色。</p>
                <button
                  type="button"
                  className="pl-lobby-page__empty-button"
                  onClick={() => setActiveTab('library')}
                >
                  到角色庫選擇
                </button>
              </div>
            )}
          </CharacterPickerPanel>
        }
        aside={
          <AnnouncementPanel
            announcement={lobby.announcement}
            gmName={gm?.displayName ?? '—'}
            onOpenGuide={() => showUnavailable('團務須知')}
          />
        }
        footer={
          <ReadyStatusBar
            readyCount={readyCount}
            playerCount={players.length}
            message={statusMessage}
            action={
              <ReadyButton
                isReady={me?.isReady ?? false}
                hasCharacter={myCharacter !== null}
                onToggle={() => updateMe({ isReady: !me?.isReady })}
              />
            }
          />
        }
      />
      <LobbyNotice message={notice} onDismiss={dismissNotice} />
    </>
  );
}
