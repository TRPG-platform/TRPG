import { useId } from 'react';
import './SettingSwitch.css';

// 跑團設定的開關（設計稿 p1_x_23_Component16.png）。用 role="switch"，螢幕閱讀器會念出開或關。

interface SettingSwitchProps {
  label: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}

export default function SettingSwitch({ label, isChecked, onChange }: SettingSwitchProps) {
  const labelId = useId();

  return (
    <div className="setting-switch">
      <span id={labelId} className="setting-switch__label">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-labelledby={labelId}
        className="setting-switch__track"
        onClick={() => onChange(!isChecked)}
      >
        <span className="setting-switch__knob" />
      </button>
    </div>
  );
}
