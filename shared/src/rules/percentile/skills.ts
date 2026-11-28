// 技能清單：只放技能名稱與基礎值（數值），不放規則書的說明文字。
// 分組依規格的 8 組；layout 決定在「技能一／技能二」哪一頁、左頁或右頁。

export type SkillBase = number | 'DEX_HALF' | 'EDU';

export interface SkillDefinition {
  id: string;
  name: string;
  base: SkillBase;
  /** 自訂列：要另外填項目名稱（例如 其他語言：日文）。 */
  custom?: boolean;
}

export interface SkillGroup {
  id: string;
  name: string;
  skills: SkillDefinition[];
}

const s = (id: string, name: string, base: SkillBase, custom = false): SkillDefinition =>
  custom ? { id, name, base, custom } : { id, name, base };

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'social',
    name: '社交',
    skills: [
      s('credit-rating', '信用評級', 0),
      s('charm', '魅惑', 15),
      s('intimidate', '恐嚇', 15),
      s('persuade', '說服', 10),
      s('fast-talk', '話術', 5),
      s('psychology', '心理學', 10),
      s('psychoanalysis', '心理分析／心理治療', 1),
      s('lip-reading', '＊唇語', 1),
      s('hypnosis', '＊催眠', 1),
    ],
  },
  {
    id: 'movement',
    name: '移動',
    skills: [
      s('dodge', '閃避', 'DEX_HALF'),
      s('climb', '攀爬', 20),
      s('jump', '跳躍', 20),
      s('swim', '游泳', 20),
      s('navigate', '領航', 10),
      s('ride', '騎術', 5),
      s('stealth', '隱密行動', 20),
      s('drive-auto', '自動車駕駛', 20),
      s('dive', '＊潛水', 1),
      s('pilot-1', '＊特殊駕駛', 1, true),
      s('pilot-2', '＊特殊駕駛', 1, true),
    ],
  },
  {
    id: 'combat',
    name: '戰鬥',
    skills: [
      s('throw', '投擲', 20),
      s('brawl', '鬥毆【空手】', 25),
      s('sword', '劍', 20),
      s('spear', '矛', 20),
      s('axe', '斧頭', 15),
      s('garrote', '絞殺', 15),
      s('chainsaw', '電鋸', 10),
      s('flail', '連枷', 10),
      s('whip', '鞭子', 5),
      s('fighting-other-1', '其他', 1, true),
      s('fighting-other-2', '其他', 1, true),
      s('fighting-other-3', '其他', 1, true),
    ],
  },
  {
    id: 'firearms',
    name: '槍枝',
    skills: [
      s('bow', '弓箭', 15),
      s('handgun', '手槍', 20),
      s('rifle', '步槍／霰彈槍', 25),
      s('smg', '衝鋒槍', 15),
      s('machine-gun', '機關槍', 10),
      s('heavy-weapons', '重武器', 10),
      s('flamethrower', '火焰噴射器', 10),
      s('artillery', '＊砲術', 1),
      s('demolitions', '＊爆破', 1),
      s('firearms-other', '＊其他', 1, true),
    ],
  },
  {
    id: 'language',
    name: '語言',
    skills: [
      s('native-language', '母語', 'EDU', true),
      s('other-language-1', '其他語言', 1, true),
      s('other-language-2', '＊其他語言', 1, true),
      s('other-language-3', '＊其他語言', 1, true),
    ],
  },
  {
    id: 'knowledge',
    name: '學問',
    skills: [
      s('mathematics', '數學', 10),
      s('chemistry', '化學', 1),
      s('pharmacy', '藥學', 1),
      s('anthropology', '人類學', 1),
      s('archaeology', '考古學', 1),
      s('electronics', '電子學', 1),
      s('physics', '物理學', 1),
      s('engineering', '工程學', 1),
      s('cryptography', '密碼學', 1),
      s('astronomy', '天文學', 1),
      s('geology', '地質學', 1),
      s('meteorology', '氣象學', 1),
      s('biology', '生物學', 1),
      s('zoology', '動物學', 1),
      s('botany', '植物學', 1),
      s('forensics', '鑑識學', 1),
      s('first-aid', '急救', 30),
      s('medicine', '醫學', 1),
      s('science-other-1', '其他科學', 1, true),
      s('science-other-2', '其他科學', 1, true),
      s('cthulhu-mythos', '克蘇魯神話', 0),
      s('special-knowledge-1', '＊特殊學問', 1, true),
      s('special-knowledge-2', '＊特殊學問', 1, true),
    ],
  },
  {
    id: 'profession',
    name: '職業興趣',
    skills: [
      s('natural-world', '自然學', 10),
      s('occult', '神秘學', 5),
      s('history', '歷史', 5),
      s('accounting', '會計', 5),
      s('appraise', '估價', 5),
      s('law', '法律', 5),
      s('disguise', '喬裝', 5),
      s('computer-use', '電腦使用', 5),
      s('electrical-repair', '電器維修', 10),
      s('mechanical-repair', '機械維修', 10),
      s('heavy-machinery', '重機械操作', 1),
      s('animal-handling', '＊動物馴養', 5),
      s('locksmith', '鎖匠', 1),
      s('sleight-of-hand', '巧手', 10),
      s('survival', '生存', 10, true),
      s('art', '美術', 5),
      s('acting', '演技', 5),
      s('forgery', '偽造', 5),
      s('photography', '攝影', 5),
      s('craft-1', '美術工藝', 5, true),
      s('craft-2', '美術工藝', 5, true),
    ],
  },
  {
    id: 'investigation',
    name: '調查',
    skills: [
      s('spot-hidden', '偵察', 25),
      s('listen', '聆聽', 20),
      s('track', '追蹤', 10),
      s('library-use', '圖書館使用', 20),
    ],
  },
];

/** 技能一、技能二兩個分頁各自的左頁與右頁要放哪些分組（依 char_3、char_4 設計圖）。 */
export const SKILL_PAGES: Record<'skills1' | 'skills2', [string[], string[]]> = {
  skills1: [
    ['social', 'movement'],
    ['combat', 'firearms'],
  ],
  skills2: [
    ['language', 'knowledge'],
    ['profession', 'investigation'],
  ],
};

export const ALL_SKILLS: SkillDefinition[] = SKILL_GROUPS.flatMap((group) => group.skills);

/** 武器可以選的技能：戰鬥與槍枝分組。 */
export const WEAPON_SKILLS: SkillDefinition[] = SKILL_GROUPS.filter(
  (group) => group.id === 'combat' || group.id === 'firearms',
).flatMap((group) => group.skills);
