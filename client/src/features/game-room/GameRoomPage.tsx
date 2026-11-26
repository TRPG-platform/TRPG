import { useState } from 'react';
import HeaderAccountActions from '../../components/HeaderAccountActions';
import type { GameRoomPreview } from '../../data';
import { CharacterPanel, ClueMemo, PlayerList, RoomSettings } from './GameRoomPanels';
import RoomChat from './RoomChat';
import libraryPreview from './library-preview.jpg';
import './GameRoomPage.css';

interface GameRoomPageProps {
  role: 'gm' | 'pl';
  preview: GameRoomPreview;
}

export default function GameRoomPage({ role, preview }: GameRoomPageProps) {
  const isGm = role === 'gm';
  const [assetCategory, setAssetCategory] = useState<'背景' | '立繪' | '道具'>('背景');

  return (
    <main className="game-room">
      <header className="game-room__header">
        <div className="top-nav__start game-room__brand">
          <a className="top-nav__icon top-nav__back" href="/" aria-label="返回首頁">
            ←
          </a>
          <h1 className="top-nav__logo">TAKOYAKI</h1>
        </div>
        <span>房號 {preview.room.roomCode}</span>
        <HeaderAccountActions />
      </header>

      <div className="game-room__layout">
        <aside className="game-room__sidebar" aria-label={isGm ? 'GM 控制區' : '我的角色'}>
          {isGm ? (
            <>
              <PlayerList players={preview.players} />
              <RoomSettings room={preview.room} />
            </>
          ) : (
            <CharacterPanel character={preview.character} stats={preview.stats} />
          )}
        </aside>

        <div className="game-room__center">
          <section className="game-room__panel game-room__scene" aria-labelledby="scene-title">
            <h2 id="scene-title">場景：{preview.scene}</h2>
            <img src={libraryPreview} alt={preview.scene} />
          </section>
          <RoomChat role={isGm ? 'GM' : 'PL'} name={isGm ? '投沒透' : preview.character.name} />
        </div>

        <aside className="game-room__sidebar" aria-label="擲骰、房間資訊與備忘錄">
          <section className="game-room__panel game-room__dice" aria-labelledby="dice-title">
            <h2 id="dice-title">擲骰</h2>
            <div className="game-room__panel-body">
              <select aria-label="選擇技能" disabled>
                <option>選擇技能</option>
              </select>
              <button type="button" disabled>
                進行判定
              </button>
              <h3>擲骰紀錄</h3>
              <ul>
                {preview.rolls.map((roll) => (
                  <li key={roll}>{roll}</li>
                ))}
              </ul>
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
            <PlayerList players={preview.players} />
          )}
          <ClueMemo clues={preview.clues} />
        </aside>
      </div>
    </main>
  );
}
