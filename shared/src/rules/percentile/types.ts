// 百分骰規則模組的角色卡資料（存在 Character.ruleData 裡）。
// 結構依 docs/spectra/changes/character-card/design.md「ruleData 結構」。
// 衍生數值（困難／極限值、上限、技能最終值……）不存，一律用 calc.ts 算出來。

export const ATTRIBUTE_KEYS = [
  'STR',
  'CON',
  'DEX',
  'APP',
  'POW',
  'INT',
  'SIZ',
  'EDU',
  'LUCK',
] as const;
export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number];

export interface AttributeInput {
  initial: number;
  adjustment: number;
}

export const INJURY_STATES = ['健康', '重傷', '瀕死', '昏迷'] as const;
export type InjuryState = (typeof INJURY_STATES)[number];

export const INSANITY_STATES = ['無', '暫時性瘋狂', '不定性瘋狂', '永久性瘋狂'] as const;
export type InsanityState = (typeof INSANITY_STATES)[number];

export interface StatusInput {
  hp: number;
  mp: number;
  san: number;
  luck: number;
  injury: InjuryState;
  insanity: InsanityState;
  insanitySymptoms: string;
}

export interface SkillInput {
  id: string;
  occupation: number;
  interest: number;
  growth: number;
  usedThisSession: boolean;
  /** 自訂列（其他、其他語言……）填的項目名稱。 */
  customName?: string;
}

export interface WeaponInput {
  name: string;
  /** 使用的技能 id（戰鬥或槍枝分組）。 */
  skillId: string;
  damage: string;
  range: string;
  uses: string;
  ammo: string;
  malfunction: string;
}

export interface RelationInput {
  character: string;
  player: string;
  relation: string;
}

export interface IdentityInput {
  playerName: string;
  fileNumber: string;
  createdDate: string;
  occupationDetail: string;
  education: string;
  era: string;
  gender: string;
  age: number | null;
  ageAdjustment: '無' | '有';
  birthplace: string;
  residence: string;
  appearance: string;
}

export interface BackstoryInput {
  beliefs: string;
  significantPeople: string;
  meaningfulLocations: string;
  treasuredPossessions: string;
  traits: string;
  bonds: string;
  story: string;
  intro: string;
}

export interface RecordInput {
  relations: RelationInput[];
  scenariosPlayed: string;
  specialEvents: string;
  scars: string;
  phobias: string;
  encounters: string;
  tomes: string;
  spells: string;
}

export interface PercentileRuleData {
  version: 1;
  identity: IdentityInput;
  attributes: Record<AttributeKey, AttributeInput>;
  status: StatusInput;
  skills: SkillInput[];
  weapons: WeaponInput[];
  belongings: string;
  specialItems: string;
  backstory: BackstoryInput;
  record: RecordInput;
}
