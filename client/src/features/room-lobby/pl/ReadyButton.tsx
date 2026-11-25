import './ReadyButton.css';

// PL 的準備按鈕（room-lobby「Ready state」，設計稿 p1_x_17_Button.png）：
// 「玩家未準備」和「✓ 準備完成」切換。還沒選角色時停用。

interface ReadyButtonProps {
  isReady: boolean;
  hasCharacter: boolean;
  onToggle: () => void;
}

export default function ReadyButton({ isReady, hasCharacter, onToggle }: ReadyButtonProps) {
  return (
    <div className="ready-button-wrap">
      <button
        type="button"
        className={`ready-button${isReady ? ' ready-button--ready' : ''}`}
        aria-pressed={isReady}
        aria-describedby={hasCharacter ? undefined : 'ready-button-hint'}
        disabled={!hasCharacter}
        onClick={onToggle}
      >
        {isReady ? '✓ 準備完成' : '玩家未準備'}
      </button>
      {!hasCharacter && (
        <p id="ready-button-hint" className="ready-button__hint">
          請先選擇角色
        </p>
      )}
    </div>
  );
}
