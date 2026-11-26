import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

export interface PrivateThread {
  recipients: string[];
  id: string;
}

interface RoomChatProps {
  role: 'GM' | 'PL';
  name: string;
  threads: PrivateThread[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCloseThread: (id: string) => void;
}

interface ChatMessage {
  id: string;
  tab: string;
  body: string;
}

export default function RoomChat({
  role,
  name,
  threads,
  activeTab,
  onTabChange,
  onCloseThread,
}: RoomChatProps) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const history = useRef<HTMLDivElement>(null);
  const thread = threads.find(({ id }) => id === activeTab);
  const isOoc = activeTab === 'ooc';
  const draft = drafts[activeTab] ?? '';
  const canSend = draft.trim().length > 0;
  function selectTab(tab: string) {
    onTabChange(tab);
    if (history.current) history.current.scrollTop = 0;
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    const message = { tab: activeTab, id: crypto.randomUUID(), body: draft.trim() };
    setMessages((current) => [message, ...current]);
    setDrafts((current) => ({ ...current, [activeTab]: '' }));
    if (history.current) history.current.scrollTop = 0;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.nativeEvent.isComposing ||
      event.keyCode === 229
    )
      return;
    event.preventDefault();
    if (!event.repeat) event.currentTarget.form?.requestSubmit();
  }

  return (
    <section className="game-room__panel game-room__chat" aria-label="聊天">
      <div className="game-room__chat-tabs" role="group" aria-label="聊天分頁">
        <button type="button" aria-pressed={activeTab === 'main'} onClick={() => selectTab('main')}>
          主要
        </button>
        <button type="button" aria-pressed={isOoc} onClick={() => selectTab('ooc')}>
          場外
        </button>
        {threads.map(({ id, recipients: members }) => (
          <div className="game-room__chat-thread-tab" data-active={activeTab === id} key={id}>
            <button
              type="button"
              title={members.join('、')}
              aria-pressed={activeTab === id}
              onClick={() => selectTab(id)}
            >
              {members.join('、')}
            </button>
            <button
              type="button"
              className="game-room__chat-close"
              aria-label={`關閉 ${members.join('、')} 私密對話`}
              onClick={() => onCloseThread(id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div
        className="game-room__chat-history"
        role="log"
        aria-label={thread ? '私密訊息紀錄' : isOoc ? '場外訊息紀錄' : '主要訊息紀錄'}
        ref={history}
        tabIndex={0}
      >
        <ol>
          {messages
            .filter((message) => message.tab === activeTab)
            .map((message) => (
              <li key={message.id}>
                <span className="game-room__avatar" aria-hidden="true" />
                <div className="game-room__chat-message">
                  <strong>
                    <span className="game-room__role" data-role={role}>
                      {role}
                    </span>{' '}
                    <span className="game-room__chat-name" data-role={role}>
                      {name}
                    </span>
                  </strong>
                  <p>{message.body}</p>
                </div>
              </li>
            ))}
        </ol>
      </div>
      <form className="game-room__composer" onSubmit={sendMessage}>
        {thread && (
          <small className="game-room__chat-members">傳送給 {thread.recipients.join('、')}</small>
        )}
        <textarea
          aria-label="輸入訊息"
          placeholder="輸入訊息…"
          rows={2}
          maxLength={1000}
          value={draft}
          onChange={(event) => {
            const value = event.target.value;
            setDrafts((current) => ({ ...current, [activeTab]: value }));
          }}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" disabled={!canSend}>
          送出
        </button>
      </form>
    </section>
  );
}
