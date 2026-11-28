import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import './CharacterPickerPanel.css';

// PL 的角色選擇面板（room-lobby「Choose a character for this game」）：
// 「我的角色」「角色庫」兩個分頁和「建立新角色」按鈕。分頁支援左右鍵切換。

export type CharacterTab = 'mine' | 'library';

const TABS: { id: CharacterTab; label: string }[] = [
  { id: 'mine', label: '我的角色' },
  { id: 'library', label: '角色庫' },
];

interface CharacterPickerPanelProps {
  activeTab: CharacterTab;
  onTabChange: (tab: CharacterTab) => void;
  onCreateCharacter: () => void;
  /** 目前分頁的內容。 */
  children: ReactNode;
}

export default function CharacterPickerPanel({
  activeTab,
  onTabChange,
  onCreateCharacter,
  children,
}: CharacterPickerPanelProps) {
  const id = useId();
  const tabRefs = useRef<Record<CharacterTab, HTMLButtonElement | null>>({
    mine: null,
    library: null,
  });
  const tabId = (tab: CharacterTab) => `${id}-tab-${tab}`;
  const panelId = `${id}-panel`;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const index = TABS.findIndex((tab) => tab.id === activeTab);
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = TABS[(index + step + TABS.length) % TABS.length].id;
    onTabChange(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="character-picker" aria-label="選擇角色">
      <div className="character-picker__tabs" role="tablist" onKeyDown={handleKeyDown}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[tab.id] = element;
            }}
            id={tabId(tab.id)}
            type="button"
            role="tab"
            className="character-picker__tab"
            aria-selected={tab.id === activeTab}
            aria-controls={panelId}
            tabIndex={tab.id === activeTab ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="character-picker__toolbar">
        <button type="button" className="character-picker__create" onClick={onCreateCharacter}>
          建立新角色
        </button>
      </div>

      <div
        id={panelId}
        className="character-picker__panel"
        role="tabpanel"
        aria-labelledby={tabId(activeTab)}
      >
        {children}
      </div>
    </section>
  );
}
