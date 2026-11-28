import { useState, type ReactNode } from 'react';

// 筆記本裡共用的小元件：分頁標題、文字欄、多行欄、數字輸入框、人形剪影。

export function PageHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="sheet__heading">
      <p className="sheet__eyebrow">{eyebrow}</p>
      <h2 className="sheet__title">{title}</h2>
    </header>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  list?: string;
}

export function TextField({ label, value, onChange, placeholder, list }: TextFieldProps) {
  return (
    <label className="field">
      {label}
      <input
        className="field__input"
        value={value}
        placeholder={placeholder}
        list={list}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function TextArea({ label, value, onChange, rows = 3 }: TextAreaProps) {
  return (
    <label className="field">
      {label}
      <textarea
        className="field__input field__input--lined"
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

interface NumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  /** 允許清空（例如年齡）；不允許時清空視為 0。 */
  nullable?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** 可以先打負號或清空再輸入的整數輸入框。 */
export function NumberInput({
  value,
  onChange,
  nullable = false,
  className,
  ...rest
}: NumberInputProps) {
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);
  const shown = editing ? text : value === null ? '' : String(value);

  return (
    <input
      {...rest}
      className={className}
      inputMode="numeric"
      value={shown}
      onFocus={() => {
        setText(value === null ? '' : String(value));
        setEditing(true);
      }}
      onBlur={() => setEditing(false)}
      onChange={(event) => {
        const next = event.target.value.trim();
        if (!/^-?\d*$/.test(next)) return;
        setText(next);
        const parsed = Number.parseInt(next, 10);
        if (Number.isNaN(parsed)) onChange(nullable ? null : 0);
        else onChange(parsed);
      }}
    />
  );
}

/** 沒有立繪時的人形剪影。 */
export function Silhouette() {
  return (
    <svg viewBox="0 0 90 120" aria-hidden="true" className="silhouette">
      <circle cx="45" cy="48" r="16" fill="currentColor" />
      <path d="M14 120c2-24 15-38 31-38s29 14 31 38z" fill="currentColor" />
    </svg>
  );
}

export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="sheet__group">
      <h3 className="sheet__group-title">{title}</h3>
      {children}
    </section>
  );
}
