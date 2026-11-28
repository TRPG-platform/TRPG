import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import HeaderAccountActions from '../../components/HeaderAccountActions';
import TopNavBackButton from '../../components/TopNavBackButton';
import type { GameRoomPreview } from '../../data';
import { CharacterPanel, ClueMemo, PlayerList, RoomSettings } from './GameRoomPanels';
import DiceDemo from './DiceDemo';
import RoomChat, { type PrivateThread } from './RoomChat';
import libraryPreview from './library-preview.jpg';
import './GameRoomPage.css';

interface GameRoomPageProps {
  role: 'gm' | 'pl';
  preview: GameRoomPreview;
}

export default function GameRoomPage({ role, preview }: GameRoomPageProps) {
  const navigate = useNavigate();
  const isGm = role === 'gm';
  const [activeChat, setActiveChat] = useState('main');
  const [privateThreads, setPrivateThreads] = useState<PrivateThread[]>([]);
  const gmName = '投沒透';
  const settings = preview.room.settings;
  const [assetCategory, setAssetCategory] = useState<'背景' | '立繪' | '道具'>('背景');

  const [abilityPlayer, setAbilityPlayer] = useState<GameRoomPreview['players'][number] | null>(
    null,
  );
  const abilityCloseTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(abilityCloseTimer.current), []);

  function closeAbilityPreview() {
    window.clearTimeout(abilityCloseTimer.current);
    setAbilityPlayer(null);
  }

  function scheduleAbilityClose() {
    window.clearTimeout(abilityCloseTimer.current);
    abilityCloseTimer.current = window.setTimeout(closeAbilityPreview, 250);
  }

  function showAbilityPreview(player: GameRoomPreview['players'][number]) {
    window.clearTimeout(abilityCloseTimer.current);
    setAbilityPlayer(player);
  }
  function openPrivateThread(recipients: string[]) {
    const members = [...recipients].sort();
    const id = JSON.stringify(members);
    setPrivateThreads((current) =>
      current.some((thread) => thread.id === id)
        ? current
        : [...current, { id, recipients: members }],
    );
    setActiveChat(id);
    closeAbilityPreview();
  }

  return (
    <main className="game-room">
      <header className="game-room__header">
        <div className="top-nav__start game-room__brand">
          <TopNavBackButton label="返回首頁" onClick={() => navigate('/')} />
          <h1 className="top-nav__logo">TAKOYAKI</h1>
        </div>
        <span>房號 {preview.room.roomCode}</span>
        <HeaderAccountActions />
      </header>

      <div className="game-room__layout">
        <aside className="game-room__sidebar" aria-label={isGm ? 'GM 控制區' : '我的角色'}>
          {isGm ? (
            <>
              <PlayerList
                onPreview={showAbilityPreview}
                onPreviewLeave={scheduleAbilityClose}
                activePlayer={abilityPlayer?.name}
                players={preview.players}
                onWhisper={
                  settings.allowGmToPlayerWhispers
                    ? (recipient) => openPrivateThread([recipient])
                    : undefined
                }
              />
              <RoomSettings room={preview.room} />
            </>
          ) : (
            <CharacterPanel character={preview.character} stats={preview.stats} />
          )}
        </aside>

        <div className="game-room__center">
          <div className="game-room__scene-anchor">
            <section className="game-room__panel game-room__scene" aria-labelledby="scene-title">
              <h2 id="scene-title">場景：{preview.scene}</h2>
              <img src={libraryPreview} alt={preview.scene} />
            </section>
            {abilityPlayer && (
              <aside
                className="game-room__player-flyout"
                aria-label={`${abilityPlayer.name} 的能力值`}
                onPointerEnter={() => window.clearTimeout(abilityCloseTimer.current)}
                onPointerLeave={scheduleAbilityClose}
              >
                <div className="game-room__player-flyout-bar">
                  <strong>能力值</strong>
                  <button
                    type="button"
                    aria-label={`關閉 ${abilityPlayer.name} 的能力值`}
                    onClick={closeAbilityPreview}
                  >
                    ×
                  </button>
                </div>
                <CharacterPanel character={abilityPlayer} stats={abilityPlayer} />
              </aside>
            )}
          </div>
          <RoomChat
            role={isGm ? 'GM' : 'PL'}
            name={isGm ? gmName : preview.character.name}
            threads={privateThreads}
            activeTab={activeChat}
            onTabChange={setActiveChat}
            onCloseThread={(id) => {
              setPrivateThreads((current) => current.filter((thread) => thread.id !== id));
              setActiveChat((current) => (current === id ? 'ooc' : current));
            }}
          />
        </div>

        <aside className="game-room__sidebar" aria-label="擲骰、房間資訊與備忘錄">
          <section className="game-room__panel game-room__dice" aria-labelledby="dice-title">
            <h2 id="dice-title">擲骰</h2>
            <div className="game-room__panel-body">
              <DiceDemo sampleRolls={preview.rolls} />
            </div>
          </section>
          {isGm ? (
            <section className="game-room__panel game-room__assets" aria-label="素材庫">
              <div className="game-room__asset-controls" role="group" aria-label="素材類別">
                {(['背景', '立繪', '道具'] as const).map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={assetCategory === category}
                    onClick={() => setAssetCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="game-room__asset-grid">
                {assetCategory === '背景' && <img src={libraryPreview} alt={preview.scene} />}
                {Array.from({ length: assetCategory === '背景' ? 5 : 6 }, (_, index) => (
                  <span key={index} aria-hidden="true" />
                ))}
              </div>
            </section>
          ) : (
            <PlayerList
              players={preview.players}
              ownPlayerName={preview.character.name}
              onWhisper={
                settings.allowPlayerToPlayerWhispers
                  ? (recipient) => openPrivateThread([recipient])
                  : undefined
              }
            />
          )}
          <ClueMemo clues={preview.clues} />
        </aside>
      </div>
    </main>
  );
}
