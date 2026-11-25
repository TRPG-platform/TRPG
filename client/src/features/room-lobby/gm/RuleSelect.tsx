import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import LobbyIcon from '../components/LobbyIcon';
import './RuleSelect.css';

// 規則下拉選單（設計稿 p1_x_30_Component28.png）。
// 原生 <select> 的展開清單無法照設計稿換樣式，所以自己做 listbox，並支援鍵盤：
// 上下鍵移動、Enter／空白鍵選取、Esc 關閉、點選單外面關閉。

interface RuleSelectProps {
  /** 外部標籤的 id，例如「使用規則」。 */
  labelId: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}

export default function RuleSelect({ labelId, value, options, onChange }: RuleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const buttonId = `${id}-button`;
  const optionId = (index: number) => `${id}-option-${index}`;

  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.focus();

    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutside);
    return () => document.removeEventListener('pointerdown', closeOnOutside);
  }, [isOpen]);

  function open() {
    setActiveIndex(Math.max(0, options.indexOf(value)));
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function choose(index: number) {
    onChange(options[index]);
    close();
  }

  function handleButtonKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
    }
  }

  function handleListKeyDown(event: KeyboardEvent) {
    const last = options.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, last));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(last);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }

  return (
    <div className="rule-select" ref={rootRef}>
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className="rule-select__button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${labelId} ${buttonId}`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleButtonKeyDown}
      >
        <span>{value}</span>
        <LobbyIcon
          name="chevronDown"
          size={18}
          className={`rule-select__chevron${isOpen ? ' rule-select__chevron--open' : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          className="rule-select__list"
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={optionId(activeIndex)}
          onKeyDown={handleListKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option}
              id={optionId(index)}
              role="option"
              aria-selected={option === value}
              className={`rule-select__option${index === activeIndex ? ' rule-select__option--active' : ''}`}
              onPointerMove={() => setActiveIndex(index)}
              onClick={() => choose(index)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
