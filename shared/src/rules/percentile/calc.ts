// 百分骰規則的衍生數值計算（純函式）。
// 規則依 docs/spectra/changes/character-card/specs/percentile-rules/spec.md。
// 前端用來顯示試算值；之後後端也用同一份計算，伺服器回傳的值才是最終依據。

import { findOccupation } from './occupations.js';
import { ALL_SKILLS, type SkillDefinition } from './skills.js';
import {
  ATTRIBUTE_KEYS,
  type AttributeKey,
  type PercentileRuleData,
  type SkillInput,
} from './types.js';

export interface AttributeValue {
  current: number;
  hard: number;
  extreme: number;
  /** 目前值不在 1–99 之間。 */
  outOfRange: boolean;
}

export interface SkillValue {
  base: number;
  final: number;
  half: number;
  fifth: number;
  /** 有職業、興趣或成長點數。 */
  trained: boolean;
}

export interface PointBudget {
  used: number;
  available: number;
  /** 顯示用的公式，例如「EDU × 2 ＋ APP × 2」。 */
  formula: string;
  over: boolean;
}

export interface DerivedSheet {
  attributes: Record<AttributeKey, AttributeValue>;
  maximums: { hp: number; mp: number; san: number; luck: number };
  /** 力量＋體型超過 204 時為 null（第一階段不支援，見 design.md）。 */
  build: number | null;
  damageBonus: string | null;
  move: number;
  skills: Record<string, SkillValue>;
  occupationPoints: PointBudget;
  interestPoints: PointBudget;
}

const half = (value: number) => Math.floor(value / 2);
const fifth = (value: number) => Math.floor(value / 5);

export function attributeValue(initial: number, adjustment: number): AttributeValue {
  const current = initial + adjustment;
  return {
    current,
    hard: half(current),
    extreme: fifth(current),
    outOfRange: current < 1 || current > 99,
  };
}

export function skillBase(skill: SkillDefinition, dex: number, edu: number): number {
  if (skill.base === 'DEX_HALF') return half(dex);
  if (skill.base === 'EDU') return edu;
  return skill.base;
}

export function skillValue(base: number, input: SkillInput | undefined): SkillValue {
  const points = input ? input.occupation + input.interest + input.growth : 0;
  const final = Math.min(99, base + points);
  return { base, final, half: half(final), fifth: fifth(final), trained: points > 0 };
}

/** 體格與傷害加成，依 STR＋SIZ。超過 204 回傳 null。 */
export function buildAndDamageBonus(
  strPlusSiz: number,
): { build: number; damageBonus: string } | null {
  if (strPlusSiz <= 64) return { build: -2, damageBonus: '-2' };
  if (strPlusSiz <= 84) return { build: -1, damageBonus: '-1' };
  if (strPlusSiz <= 124) return { build: 0, damageBonus: '0' };
  if (strPlusSiz <= 164) return { build: 1, damageBonus: '+1D4' };
  if (strPlusSiz <= 204) return { build: 2, damageBonus: '+1D6' };
  return null;
}

/** 移動力：比較 DEX、STR 與 SIZ，40 歲起每 10 歲減 1。 */
export function moveRate(str: number, dex: number, siz: number, age: number | null): number {
  let move = dex < siz && str < siz ? 7 : dex > siz && str > siz ? 9 : 8;
  if (age !== null && age >= 40) move -= Math.min(5, Math.floor((age - 30) / 10));
  return move;
}

export function deriveSheet(data: PercentileRuleData, occupation: string): DerivedSheet {
  const attributes = {} as Record<AttributeKey, AttributeValue>;
  for (const key of ATTRIBUTE_KEYS) {
    const input = data.attributes[key];
    attributes[key] = attributeValue(input.initial, input.adjustment);
  }
  const a = (key: AttributeKey) => attributes[key].current;

  const inputs = new Map(data.skills.map((skill) => [skill.id, skill]));
  const skills: Record<string, SkillValue> = {};
  for (const skill of ALL_SKILLS) {
    skills[skill.id] = skillValue(skillBase(skill, a('DEX'), a('EDU')), inputs.get(skill.id));
  }

  const job = findOccupation(occupation);
  const best = job?.bestOf.length
    ? job.bestOf.reduce((top, key) => (a(key) > a(top) ? key : top))
    : null;
  const occupationAvailable = best ? a('EDU') * 2 + a(best) * 2 : a('EDU') * 4;
  const occupationFormula = best
    ? `EDU × 2 ＋ ${best} × 2${job && job.bestOf.length > 1 ? `（${job.bestOf.join('／')} 取最高）` : ''}`
    : 'EDU × 4';
  const occupationUsed = data.skills.reduce((sum, skill) => sum + skill.occupation, 0);
  const interestUsed = data.skills.reduce((sum, skill) => sum + skill.interest, 0);
  const interestAvailable = a('INT') * 2;

  const bodyStats = buildAndDamageBonus(a('STR') + a('SIZ'));

  return {
    attributes,
    maximums: {
      hp: Math.floor((a('CON') + a('SIZ')) / 10),
      mp: fifth(a('POW')),
      san: 99 - (skills['cthulhu-mythos']?.final ?? 0),
      luck: 99,
    },
    build: bodyStats?.build ?? null,
    damageBonus: bodyStats?.damageBonus ?? null,
    move: moveRate(a('STR'), a('DEX'), a('SIZ'), data.identity.age),
    skills,
    occupationPoints: {
      used: occupationUsed,
      available: occupationAvailable,
      formula: occupationFormula,
      over: occupationUsed > occupationAvailable,
    },
    interestPoints: {
      used: interestUsed,
      available: interestAvailable,
      formula: 'INT × 2',
      over: interestUsed > interestAvailable,
    },
  };
}

/** 把數值夾在 0 到上限之間（目前 HP／MP／SAN／LUCK 用）。 */
export function clampStatus(value: number, maximum: number): number {
  return Math.max(0, Math.min(maximum, value));
}
