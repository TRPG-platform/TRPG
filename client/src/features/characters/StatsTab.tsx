import {
  ATTRIBUTE_KEYS,
  INJURY_STATES,
  INSANITY_STATES,
  clampStatus,
  type AttributeKey,
  type DerivedSheet,
} from '@takoyaki/shared';
import type { Draft, UpdateDraft } from './draft';
import { NumberInput, PageHeading, TextField } from './fields';

// 數值分頁：九項屬性（初始＋調整、困難、極限），HP／MP／SAN／LUCK、體格、傷害加成、移動力、傷勢、瘋狂。

const ATTRIBUTE_NAMES: Record<AttributeKey, string> = {
  STR: '力量',
  CON: '體質',
  DEX: '敏捷',
  APP: '外貌',
  POW: '意志',
  INT: '智力',
  SIZ: '體型',
  EDU: '教育',
  LUCK: '幸運',
};

const GAUGES = [
  { key: 'hp', label: 'HP', name: '生命值' },
  { key: 'mp', label: 'MP', name: '魔法值' },
  { key: 'san', label: 'SAN', name: '理智值' },
  { key: 'luck', label: 'LUCK', name: '幸運值' },
] as const;

interface StatsTabProps {
  draft: Draft;
  derived: DerivedSheet;
  update: UpdateDraft;
}

export default function StatsTab({ draft, derived, update }: StatsTabProps) {
  const status = draft.data.status;
  const outOfRange = ATTRIBUTE_KEYS.filter((key) => derived.attributes[key].outOfRange);

  return (
    <>
      <div className="sheet__page">
        <PageHeading eyebrow="ATTRIBUTES" title="角色數值屬性" />
        {outOfRange.length > 0 && (
          <p className="sheet__alert" role="alert">
            ⚠ 屬性值需介於 1 到 99（{outOfRange.join('、')}）
          </p>
        )}
        <div className="attributes">
          {ATTRIBUTE_KEYS.map((key) => {
            const value = derived.attributes[key];
            const input = draft.data.attributes[key];
            return (
              <div
                key={key}
                className={`attribute${value.outOfRange ? ' attribute--invalid' : ''}`}
              >
                <div className="attribute__head">
                  <b>{key}</b>
                  <span>{ATTRIBUTE_NAMES[key]}</span>
                </div>
                <div className="attribute__value">{value.current}</div>
                <div className="attribute__levels">
                  困難 <b>{value.hard}</b>
                  <span className="attribute__gap" />
                  極限 <b>{value.extreme}</b>
                </div>
                <div className="attribute__inputs">
                  <label>
                    初始
                    <NumberInput
                      value={input.initial}
                      onChange={(next) =>
                        update((d) => {
                          d.data.attributes[key].initial = next ?? 0;
                        })
                      }
                    />
                  </label>
                  <label>
                    調整
                    <NumberInput
                      value={input.adjustment}
                      onChange={(next) =>
                        update((d) => {
                          d.data.attributes[key].adjustment = next ?? 0;
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        <h3 className="sheet__group-title">職業點數</h3>
        <p className="sheet__note">
          職業點數 ＝ {derived.occupationPoints.formula} ＝ {derived.occupationPoints.available}
          ；興趣點數 ＝ INT × 2 ＝ {derived.interestPoints.available}
        </p>
      </div>

      <div className="sheet__page">
        <PageHeading eyebrow="CONDITION" title="調查員當前狀態" />
        <div className="gauges">
          {GAUGES.map(({ key, label, name }) => {
            const maximum = derived.maximums[key];
            const current = status[key];
            const ratio = maximum ? Math.max(0, Math.min(1, current / maximum)) : 0;
            const set = (value: number) =>
              update((d) => {
                d.data.status[key] = clampStatus(value, maximum);
              });
            return (
              <div key={key} className="gauge">
                <div className="gauge__head">
                  <b>{label}</b>
                  <span>{name}</span>
                </div>
                <div className="gauge__controls">
                  <button type="button" aria-label={`${name}減一`} onClick={() => set(current - 1)}>
                    −
                  </button>
                  <NumberInput
                    className="gauge__input"
                    aria-label={`${name}目前值`}
                    value={current}
                    onChange={(next) => set(next ?? 0)}
                  />
                  <span className="gauge__max">/ {maximum}</span>
                  <button type="button" aria-label={`${name}加一`} onClick={() => set(current + 1)}>
                    +
                  </button>
                  <div className={`gauge__bar${ratio <= 0.25 ? ' gauge__bar--low' : ''}`}>
                    <i style={{ width: `${ratio * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="derived">
          <div>
            <small>體格 BUILD</small>
            <b>{derived.build ?? '—'}</b>
          </div>
          <div>
            <small>傷害加成 DB</small>
            <b>{derived.damageBonus ?? '—'}</b>
          </div>
          <div>
            <small>機動 MOV</small>
            <b>{derived.move}</b>
          </div>
        </div>
        {derived.build === null && (
          <p className="sheet__alert">⚠ 數值超出支援範圍（力量＋體型最多 204）</p>
        )}

        <h3 className="sheet__group-title">傷勢</h3>
        <div className="chips">
          {INJURY_STATES.map((state) => (
            <button
              key={state}
              type="button"
              className="chip"
              aria-pressed={status.injury === state}
              onClick={() =>
                update((d) => {
                  d.data.status.injury = state;
                })
              }
            >
              {state}
            </button>
          ))}
        </div>
        <h3 className="sheet__group-title">瘋狂狀態</h3>
        <div className="chips">
          {INSANITY_STATES.map((state) => (
            <button
              key={state}
              type="button"
              className="chip"
              aria-pressed={status.insanity === state}
              onClick={() =>
                update((d) => {
                  d.data.status.insanity = state;
                })
              }
            >
              {state}
            </button>
          ))}
        </div>
        <div className="stack stack--spaced">
          <TextField
            label="瘋狂症狀"
            value={status.insanitySymptoms}
            placeholder="無"
            onChange={(value) =>
              update((d) => {
                d.data.status.insanitySymptoms = value;
              })
            }
          />
        </div>
      </div>
    </>
  );
}
