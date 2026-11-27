import { useEffect, useId, useRef, type ReactNode } from 'react';
import './ConfirmDialog.css';

// 共用確認視窗：刪除、確定離開、確定修改等「要使用者再按一次確認」的地方都用這個。
// 呼叫端決定什麼時候顯示（條件渲染），這裡只負責畫面與鍵盤操作：
// - 按 Esc 或點視窗外面 = 取消
// - 打開時焦點放在「取消」，避免按 Enter 就誤觸確認
//
// 用法：
//   {confirming && (
//     <ConfirmDialog
//       title="刪除「爬爬牙」？"
//       confirmLabel="確定刪除"
//       onConfirm={remove}
//       onCancel={() => setConfirming(false)}
//     >
//       這位調查員的所有資料都會刪除，無法復原。
//     </ConfirmDialog>
//   )}

interface ConfirmDialogProps {
  /** 標題，通常是一個問句，例如「確定離開？」。 */
  title: ReactNode;
  /** 說明文字。 */
  children?: ReactNode;
  /** 確認按鈕的文字，例如「確定刪除」。 */
  confirmLabel: string;
  /** 取消按鈕的文字，預設「取消」。 */
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** 有值時在說明下方顯示錯誤（例如刪除或存檔失敗），視窗不關閉。 */
  error?: string;
  /** 處理中（例如存檔中）：按鈕停用，確認按鈕顯示 busyLabel。 */
  busy?: boolean;
  busyLabel?: string;
}

export default function ConfirmDialog({
  title,
  children,
  confirmLabel,
  cancelLabel = '取消',
  onConfirm,
  onCancel,
  error,
  busy = false,
  busyLabel = '處理中…',
}: ConfirmDialogProps) {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [busy, onCancel]);

  return (
    <div className="confirm-dialog__backdrop" onClick={() => !busy && onCancel()}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="confirm-dialog__title">
          {title}
        </h2>
        {children && <p className="confirm-dialog__message">{children}</p>}
        {error && (
          <p className="confirm-dialog__error" role="alert">
            ⚠ {error}
          </p>
        )}
        <div className="confirm-dialog__actions">
          <button
            ref={cancelRef}
            type="button"
            className="confirm-dialog__button"
            disabled={busy}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-dialog__button confirm-dialog__button--primary"
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
