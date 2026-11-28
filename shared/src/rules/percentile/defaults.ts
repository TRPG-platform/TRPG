import {
  ATTRIBUTE_KEYS,
  INJURY_STATES,
  INSANITY_STATES,
  type AttributeKey,
  type AttributeInput,
  type PercentileRuleData,
  type SkillInput,
  type WeaponInput,
  type RelationInput,
} from './types.js';

/** 新角色的空白資料。屬性預設 50，目前 HP／MP／SAN／LUCK 依預設屬性設成起始值。 */
export function createBlankRuleData(): PercentileRuleData {
  const attributes = {} as Record<AttributeKey, AttributeInput>;
  for (const key of ATTRIBUTE_KEYS) attributes[key] = { initial: 50, adjustment: 0 };

  return {
    version: 1,
    identity: {
      playerName: '',
      fileNumber: '',
      createdDate: '',
      occupationDetail: '',
      education: '',
      era: '',
      gender: '',
      age: null,
      ageAdjustment: '無',
      birthplace: '',
      residence: '',
      appearance: '',
    },
    attributes,
    // HP = (CON+SIZ)/10、MP = POW/5、SAN = POW、LUCK = LUCK（屬性皆 50 時）
    status: {
      hp: 10,
      mp: 10,
      san: 50,
      luck: 50,
      injury: '健康',
      insanity: '無',
      insanitySymptoms: '',
    },
    skills: [],
    weapons: [],
    belongings: '',
    specialItems: '',
    backstory: {
      beliefs: '',
      significantPeople: '',
      meaningfulLocations: '',
      treasuredPossessions: '',
      traits: '',
      bonds: '',
      story: '',
      intro: '',
    },
    record: {
      relations: [],
      scenariosPlayed: '',
      specialEvents: '',
      scars: '',
      phobias: '',
      encounters: '',
      tomes: '',
      spells: '',
    },
  };
}

type Loose = Record<string, unknown>;
const isObject = (value: unknown): value is Loose =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const str = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);
const int = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : fallback;
const oneOf = <T extends string>(value: unknown, options: readonly T[], fallback: T): T =>
  options.includes(value as T) ? (value as T) : fallback;

/**
 * 把 Character.ruleData（型別是 unknown 的物件）整理成完整的 PercentileRuleData。
 * 缺的欄位補預設值，格式不對的欄位丟掉，讓畫面不必到處檢查 undefined。
 */
export function normalizeRuleData(raw: unknown): PercentileRuleData {
  const blank = createBlankRuleData();
  if (!isObject(raw)) return blank;

  const identity = isObject(raw.identity) ? raw.identity : {};
  const attributes = isObject(raw.attributes) ? raw.attributes : {};
  const status = isObject(raw.status) ? raw.status : {};
  const backstory = isObject(raw.backstory) ? raw.backstory : {};
  const record = isObject(raw.record) ? raw.record : {};

  const attributeData = {} as Record<AttributeKey, AttributeInput>;
  for (const key of ATTRIBUTE_KEYS) {
    const value = isObject(attributes[key]) ? attributes[key] : {};
    attributeData[key] = {
      initial: int(value.initial, blank.attributes[key].initial),
      adjustment: int(value.adjustment),
    };
  }

  const skills: SkillInput[] = (Array.isArray(raw.skills) ? raw.skills : [])
    .filter(isObject)
    .filter((skill) => typeof skill.id === 'string')
    .map((skill) => ({
      id: skill.id as string,
      occupation: int(skill.occupation),
      interest: int(skill.interest),
      growth: int(skill.growth),
      usedThisSession: skill.usedThisSession === true,
      ...(typeof skill.customName === 'string' ? { customName: skill.customName } : {}),
    }));

  const weapons: WeaponInput[] = (Array.isArray(raw.weapons) ? raw.weapons : [])
    .filter(isObject)
    .map((weapon) => ({
      name: str(weapon.name),
      skillId: str(weapon.skillId),
      damage: str(weapon.damage),
      range: str(weapon.range),
      uses: str(weapon.uses),
      ammo: str(weapon.ammo),
      malfunction: str(weapon.malfunction),
    }));

  const relations: RelationInput[] = (Array.isArray(record.relations) ? record.relations : [])
    .filter(isObject)
    .map((relation) => ({
      character: str(relation.character),
      player: str(relation.player),
      relation: str(relation.relation),
    }));

  return {
    version: 1,
    identity: {
      playerName: str(identity.playerName),
      fileNumber: str(identity.fileNumber),
      createdDate: str(identity.createdDate),
      occupationDetail: str(identity.occupationDetail),
      education: str(identity.education),
      era: str(identity.era),
      gender: str(identity.gender),
      age: typeof identity.age === 'number' ? int(identity.age) : null,
      ageAdjustment: identity.ageAdjustment === '有' ? '有' : '無',
      birthplace: str(identity.birthplace),
      residence: str(identity.residence),
      appearance: str(identity.appearance),
    },
    attributes: attributeData,
    status: {
      hp: int(status.hp, blank.status.hp),
      mp: int(status.mp, blank.status.mp),
      san: int(status.san, blank.status.san),
      luck: int(status.luck, blank.status.luck),
      injury: oneOf(status.injury, INJURY_STATES, '健康'),
      insanity: oneOf(status.insanity, INSANITY_STATES, '無'),
      insanitySymptoms: str(status.insanitySymptoms),
    },
    skills,
    weapons,
    belongings: str(raw.belongings),
    specialItems: str(raw.specialItems),
    backstory: {
      beliefs: str(backstory.beliefs),
      significantPeople: str(backstory.significantPeople),
      meaningfulLocations: str(backstory.meaningfulLocations),
      treasuredPossessions: str(backstory.treasuredPossessions),
      traits: str(backstory.traits),
      bonds: str(backstory.bonds),
      story: str(backstory.story),
      intro: str(backstory.intro),
    },
    record: {
      relations,
      scenariosPlayed: str(record.scenariosPlayed),
      specialEvents: str(record.specialEvents),
      scars: str(record.scars),
      phobias: str(record.phobias),
      encounters: str(record.encounters),
      tomes: str(record.tomes),
      spells: str(record.spells),
    },
  };
}
