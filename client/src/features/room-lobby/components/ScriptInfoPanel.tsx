import type { RoomLobbyState } from '../../../data/roomLobby';
import { formatDuration, formatSchedule } from '../lobbyFormat';
import './ScriptInfoPanel.css';

// 房間大廳左欄的劇本資訊（room-lobby「Lobby overview」），GM 和 PL 共用。

interface ScriptInfoPanelProps {
  script: RoomLobbyState['script'];
  ruleName: string;
  playStyle: string;
  /** 房間目前使用的規則（GM 可以在跑團設定修改）。 */
  ruleSystem: string;
  gmName: string;
  playerCount: number;
  maxPlayers: number;
  scheduledAt: string | null;
}

export default function ScriptInfoPanel({
  script,
  ruleName,
  playStyle,
  ruleSystem,
  gmName,
  playerCount,
  maxPlayers,
  scheduledAt,
}: ScriptInfoPanelProps) {
  const duration = formatDuration(script.estimatedHoursMin, script.estimatedHoursMax);

  return (
    <section className="script-info" aria-labelledby="script-info-title">
      {script.coverUrl ? (
        <img className="script-info__cover" src={script.coverUrl} alt={`${script.title} 封面`} />
      ) : (
        // TODO：等設計稿封面圖匯出後換成實際圖片
        <div className="script-info__cover script-info__cover--empty" aria-hidden="true" />
      )}

      <h2 id="script-info-title" className="script-info__title">
        {script.title}
      </h2>
      <p className="script-info__subtitle">
        {ruleName} ・ {playStyle}
      </p>

      <p className="script-info__synopsis">{script.synopsis}</p>

      <dl className="script-info__meta">
        <div>
          <dt>GM</dt>
          <dd>{gmName}</dd>
        </div>
        <div>
          <dt>規則</dt>
          <dd>{ruleSystem}</dd>
        </div>
        <div>
          <dt>玩家</dt>
          <dd>
            {playerCount} / {maxPlayers}
          </dd>
        </div>
        {duration && (
          <div>
            <dt>時長</dt>
            <dd>{duration}</dd>
          </div>
        )}
        {scheduledAt && (
          <div className="script-info__meta-wide">
            <dt>開團</dt>
            <dd>{formatSchedule(scheduledAt)}</dd>
          </div>
        )}
      </dl>

      {script.tags.length > 0 && (
        <ul className="script-info__tags" aria-label="標籤">
          {script.tags.map((tag) => (
            <li key={tag} className="script-info__tag">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
