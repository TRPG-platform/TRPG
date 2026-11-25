import { useState } from 'react';
import type { GameRoomPreview } from '../../data';
import { CharacterPanel, ClueMemo, PlayerList, RoomSettings } from './GameRoomPanels';
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
        <a href="/" aria-label="返回首頁">
          ←
        </a>
        <h1>TAKOYAKI</h1>
        <span>房號 {preview.room.roomCode}</span>
        <nav aria-label="切換預覽角色">
          <a href="?game-room=gm" aria-current={isGm ? 'page' : undefined}>
            GM
          </a>
          <a href="?game-room=pl" aria-current={isGm ? undefined : 'page'}>
            PL
          </a>
        </nav>
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
          <section className="game-room__panel game-room__chat" aria-labelledby="chat-title">
            <h2 id="chat-title">
              主要頻道 <span>Dice / GM公告</span>
            </h2>
            <ol>
              {preview.messages.map((message) => (
                <li key={message.name}>
                  <span className="game-room__avatar" aria-hidden="true" />
                  <div>
                    <strong>
                      <span className="game-room__role" data-role={message.role}>
                        {message.role}
                      </span>{' '}
                      {message.name}
                    </strong>
                    <p>{message.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="game-room__composer">
              <input aria-label="輸入訊息" placeholder="輸入訊息…" disabled />
              <button type="button" disabled>
                送出
              </button>
            </div>
          </section>
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
