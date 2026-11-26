import { useState, type FormEvent } from 'react';
import { getMockPreview } from '../data';
import TopNav from '../components/TopNav';

export function JoinRoomPage() {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      setFeedback('請輸入 6 碼英文字母或數字。');
      return;
    }

    const preview = getMockPreview();
    setFeedback(
      preview
        ? code === preview.room.roomCode
          ? `已找到房間：${preview.script.title}（預覽）`
          : '找不到這個房號。'
        : '房間加入功能尚未接上。',
    );
  }

  return (
    <div className="figma-layout">
      <TopNav />
      <main className="join-layout">
        <h1>加入劇本房間</h1>
        <p>輸入房號，現在就加入 GM / KP 開設的跑團房間。</p>
        <form className="join-panel" onSubmit={submit}>
          <label>
            <span aria-hidden="true">⚿</span>
            <input
              aria-label="房號"
              autoComplete="off"
              maxLength={6}
              placeholder="請輸入房號 (例如：A7F3K9)"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.toUpperCase());
                setFeedback('');
              }}
            />
          </label>
          <button type="submit">↪ 加入房間</button>
          {feedback && <p role="status">{feedback}</p>}
        </form>
      </main>
    </div>
  );
}
