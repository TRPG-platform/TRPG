import { useState, type FormEvent, type KeyboardEvent } from 'react';

interface RoomChatProps {
  role: 'GM' | 'PL';
  name: string;
}

interface ChatMessage {
  id: string;
  body: string;
}

export default function RoomChat({ role, name }: RoomChatProps) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const canSend = draft.trim().length > 0;

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;

    const message = { id: crypto.randomUUID(), body: draft.trim() };
    setMessages((current) => [...current, message]);
    setDraft('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing &&
      event.keyCode !== 229
    ) {
      event.preventDefault();
      if (!event.repeat) event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <section className="game-room__panel game-room__chat" aria-labelledby="chat-title">
      <h2 id="chat-title">
        主要頻道 <span>Dice / GM公告</span>
      </h2>
      <div role="log" aria-labelledby="chat-title">
        <ol>
          {messages.map((message) => (
            <li key={message.id}>
              <span className="game-room__avatar" aria-hidden="true" />
              <div className="game-room__chat-message">
                <strong>
                  <span className="game-room__role" data-role={role}>
                    {role}
                  </span>{' '}
                  {name}
                </strong>
                <p>{message.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <form className="game-room__composer" onSubmit={sendMessage}>
        <textarea
          aria-label="輸入訊息"
          placeholder="輸入訊息…"
          rows={2}
          maxLength={1000}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" disabled={!canSend}>
          送出
        </button>
      </form>
    </section>
  );
}
