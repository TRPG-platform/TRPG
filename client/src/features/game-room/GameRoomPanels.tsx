import type { GameRoomPreview } from '../../data';

type Player = GameRoomPreview['players'][number];

type PlayerListProps = {
  players: Player[];
  onWhisper?: (name: string) => void;
  onPreview?: (player: Player) => void;
  onPreviewLeave?: () => void;
  activePlayer?: string;
  ownPlayerName?: string;
};

export function PlayerList({
  players,
  onWhisper,
  onPreview,
  onPreviewLeave,
  activePlayer,
  ownPlayerName,
}: PlayerListProps) {
  return (
    <section className="game-room__panel">
      <h2>玩家列表</h2>
      <ul className="game-room__players">
        {players.map((player) => (
          <li key={player.name} className="game-room__player">
            <div className="game-room__player-row">
              {onPreview ? (
                <>
                  <button
                    type="button"
                    className="game-room__player-preview"
                    aria-label={`查看 ${player.name} 的能力值`}
                    aria-expanded={activePlayer === player.name}
                    onPointerEnter={(event) => {
                      if (event.pointerType === 'mouse') onPreview(player);
                    }}
                    onPointerLeave={onPreviewLeave}
                    onClick={() => onPreview(player)}
                  >
                    <span className="game-room__avatar" aria-hidden="true" />
                    <span className="game-room__role">PL</span>
                    <span className="game-room__player-info">
                      <strong>{player.name}</strong>
                      <small>{player.occupation}</small>
                      <small>
                        HP {player.hp} · SAN {player.san}
                      </small>
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <span className="game-room__avatar" aria-hidden="true" />
                  <span className="game-room__role">PL</span>
                  <div className="game-room__player-info">
                    <strong>{player.name}</strong>
                    <small>{player.occupation}</small>
                  </div>
                </>
              )}
              {(onPreview || onWhisper) && player.name !== ownPlayerName && (
                <button
                  type="button"
                  className="game-room__player-options"
                  aria-label={`私訊 ${player.name}`}
                  disabled={!onWhisper}
                  onClick={() => onWhisper?.(player.name)}
                >
                  私訊
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
export function RoomSettings({ room }: { room: GameRoomPreview['room'] }) {
  const switches = [
    ['特效', room.settings.enableEffects],
    ['禁止PL上傳素材', room.settings.disallowPlayerUploads],
    ['開放密語頻道（GM→指定玩家）', room.settings.allowGmToPlayerWhispers],
    ['開放密語頻道（玩家→玩家）', room.settings.allowPlayerToPlayerWhispers],
  ] as const;

  return (
    <section className="game-room__panel game-room__settings">
      <h2>遊戲設定</h2>
      <div className="game-room__panel-body">
        <p>
          使用規則 <strong>{room.ruleSystem}</strong>
        </p>
        {switches.map(([label, enabled]) => (
          <label key={label}>
            {label}
            <input type="checkbox" role="switch" checked={enabled} disabled />
          </label>
        ))}
      </div>
    </section>
  );
}

interface CharacterPanelProps {
  character: Pick<GameRoomPreview['character'], 'name' | 'occupation'>;
  stats: {
    hp: string;
    san: string;
    attributes: readonly (readonly [string, number])[];
    skills: readonly (readonly [string, number])[];
  };
}

export function CharacterPanel({ character, stats }: CharacterPanelProps) {
  return (
    <>
      <section className="game-room__panel">
        <h2>角色</h2>
        <div className="game-room__panel-body game-room__character">
          <span className="game-room__avatar" aria-hidden="true" />
          <div>
            <strong>{character.name}</strong>
            <small>{character.occupation}</small>
          </div>
          <dl>
            <div>
              <dt>HP</dt>
              <dd>{stats.hp}</dd>
            </div>
            <div>
              <dt>SAN</dt>
              <dd>{stats.san}</dd>
            </div>
          </dl>
        </div>
      </section>
      <details className="game-room__panel" open>
        <summary>屬性</summary>
        <dl className="game-room__attributes">
          {stats.attributes.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </details>
      <details className="game-room__panel" open>
        <summary>技能（{stats.skills.length}）</summary>
        <dl className="game-room__skills">
          {stats.skills.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </details>
      {['持有物', '背景', '備註'].map((label) => (
        <details className="game-room__panel" key={label}>
          <summary>{label}</summary>
          <p className="game-room__panel-body">目前沒有資料</p>
        </details>
      ))}
    </>
  );
}

export function ClueMemo({ clues }: { clues: GameRoomPreview['clues'] }) {
  return (
    <section className="game-room__panel game-room__memo">
      <h2>備忘錄</h2>
      <div className="game-room__panel-body">
        <h3>目前線索</h3>
        <ul>
          {clues.map((clue) => (
            <li key={clue}>{clue}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
