import { useCallback, useEffect, useRef, useState } from 'react';

export interface CopyFeedback {
  /** 呼叫 copy 時傳入的識別，用來分辨是哪一個按鈕複製的。 */
  key: string;
  result: 'copied' | 'failed';
}

/** 複製文字到剪貼簿，結果顯示 resetMs 毫秒後自動清除（room-lobby「Room code and invite link」：2 秒）。 */
export function useCopyToClipboard(resetMs = 2000) {
  const [feedback, setFeedback] = useState<CopyFeedback | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copy = useCallback(
    async (key: string, text: string) => {
      window.clearTimeout(timerRef.current);
      try {
        // 非 HTTPS 或舊瀏覽器沒有 Clipboard API
        if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(text);
        setFeedback({ key, result: 'copied' });
      } catch {
        setFeedback({ key, result: 'failed' });
      }
      timerRef.current = window.setTimeout(() => setFeedback(null), resetMs);
    },
    [resetMs],
  );

  return { feedback, copy };
}
