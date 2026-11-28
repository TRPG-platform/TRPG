import LobbyIcon, { type LobbyIconName } from '../components/LobbyIcon';
import './GmToolsPanel.css';

// GM 工具（room-lobby「Start the game」）。
// 預覽房間、編輯劇本、場景與素材管理的頁面都還沒做，目前只保留入口，按下去時顯示尚未開放。

const TOOLS: { label: string; icon: LobbyIconName }[] = [
  { label: '預覽房間', icon: 'monitor' },
  { label: '編輯劇本', icon: 'edit' },
  { label: '場景與素材管理', icon: 'folder' },
];

interface GmToolsPanelProps {
  canStart: boolean;
  isStarted: boolean;
  onUnavailable: (feature: string) => void;
  onStart: () => void;
}

export default function GmToolsPanel({
  canStart,
  isStarted,
  onUnavailable,
  onStart,
}: GmToolsPanelProps) {
  let startLabel = '開始跑團';
  if (isStarted) startLabel = '跑團已開始';
  else if (!canStart) startLabel = '等待所有玩家準備';

  return (
    <section className="gm-tools" aria-labelledby="gm-tools-title">
      <h2 id="gm-tools-title" className="gm-tools__title">
        <LobbyIcon name="bolt" size={16} />
        GM 工具
      </h2>

      <div className="gm-tools__actions">
        {TOOLS.map(({ label, icon }) => (
          // TODO：頁面完成後改成導向（room-lobby「Start the game」）
          <button
            key={label}
            type="button"
            className="gm-tools__button"
            onClick={() => onUnavailable(label)}
          >
            <LobbyIcon name={icon} size={18} />
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="gm-tools__start"
        disabled={!canStart || isStarted}
        onClick={onStart}
      >
        {canStart && !isStarted && <LobbyIcon name="play" size={18} />}
        {startLabel}
      </button>
    </section>
  );
}
