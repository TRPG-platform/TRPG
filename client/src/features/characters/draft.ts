import {
  normalizeRuleData,
  type Character,
  type PercentileRuleData,
  type SkillInput,
} from '@takoyaki/shared';
import type { CharacterChanges } from '../../data/characters';

/** 編輯中的角色：通用欄位＋整理好的規則資料。 */
export interface Draft {
  id: string;
  name: string;
  occupation: string;
  portraitUrl: string | null;
  tags: string[];
  data: PercentileRuleData;
}

/** 用「修改草稿」的函式更新，例如 update((d) => { d.name = '新名字'; })。 */
export type UpdateDraft = (recipe: (draft: Draft) => void) => void;

export function toDraft(character: Character): Draft {
  return {
    id: character.id,
    name: character.name,
    occupation: character.occupation,
    portraitUrl: character.portraitUrl,
    tags: character.tags,
    data: normalizeRuleData(character.ruleData),
  };
}

export function toChanges(draft: Draft): CharacterChanges {
  return {
    name: draft.name,
    occupation: draft.occupation,
    portraitUrl: draft.portraitUrl,
    tags: draft.tags,
    ruleData: draft.data as unknown as Record<string, unknown>,
  };
}

const emptySkill = (id: string): SkillInput => ({
  id,
  occupation: 0,
  interest: 0,
  growth: 0,
  usedThisSession: false,
});

export function findSkill(data: PercentileRuleData, id: string): SkillInput {
  return data.skills.find((skill) => skill.id === id) ?? emptySkill(id);
}

/** 修改某個技能的輸入；還沒有這列時新增一列。 */
export function patchSkill(draft: Draft, id: string, patch: Partial<Omit<SkillInput, 'id'>>) {
  const existing = draft.data.skills.find((skill) => skill.id === id);
  if (existing) Object.assign(existing, patch);
  else draft.data.skills.push({ ...emptySkill(id), ...patch });
}
