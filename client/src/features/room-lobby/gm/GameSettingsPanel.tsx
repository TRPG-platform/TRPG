import { useId } from 'react';
import type { RoomLobbyState } from '../../../data/roomLobby';
import RuleSelect from './RuleSelect';
import SettingSwitch from './SettingSwitch';
import './GameSettingsPanel.css';

// GM 的跑團設定面板（room-lobby「GM game settings」）：規則下拉選單和四個開關。
// 規格只列四個開關，所以 settings.enableEffects 不顯示。
// TODO(room-lobby 3.2)：改成送出到伺服器，由即時事件 settings.updated 回來更新畫面。

type RoomSettings = RoomLobbyState['room']['settings'];

const RULE_OPTIONS = ['CoC 7e', 'CoC 6e', 'CoC 5e'] as const;

const SWITCHES: { key: keyof RoomSettings; label: string }[] = [
  { key: 'disallowExistingCharacters', label: '禁止PL使用既有角色' },
  { key: 'disallowPlayerUploads', label: '禁止PL上傳素材' },
  { key: 'allowGmToPlayerWhispers', label: '開放密語頻道（GM→指定玩家）' },
  { key: 'allowPlayerToPlayerWhispers', label: '開放密語頻道（玩家→玩家）' },
];

interface GameSettingsPanelProps {
  ruleSystem: string;
  settings: RoomSettings;
  onRuleSystemChange: (ruleSystem: string) => void;
  onSettingChange: (key: keyof RoomSettings, value: boolean) => void;
}

export default function GameSettingsPanel({
  ruleSystem,
  settings,
  onRuleSystemChange,
  onSettingChange,
}: GameSettingsPanelProps) {
  const ruleLabelId = useId();

  return (
    <section className="game-settings" aria-labelledby="game-settings-title">
      <h2 id="game-settings-title" className="game-settings__title">
        跑團設定
      </h2>

      <div className="game-settings__rule">
        <span id={ruleLabelId} className="game-settings__label">
          使用規則
        </span>
        <RuleSelect
          labelId={ruleLabelId}
          value={ruleSystem}
          options={RULE_OPTIONS}
          onChange={onRuleSystemChange}
        />
      </div>

      <div className="game-settings__switches">
        {SWITCHES.map(({ key, label }) => (
          <SettingSwitch
            key={key}
            label={label}
            isChecked={settings[key]}
            onChange={(value) => onSettingChange(key, value)}
          />
        ))}
      </div>
    </section>
  );
}
