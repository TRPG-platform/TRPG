import {
  createBlankRuleData,
  type AttributeKey,
  type Character,
  type PercentileRuleData,
  type SkillInput,
} from '@takoyaki/shared';
import { sampleCharacter } from './mock';

// 「我的角色卡」用的假資料。名字取自設計稿（TV-9、角色數值板）。

const OWNER = sampleCharacter.ownerId;

type Points = [id: string, occupation: number, interest?: number];

function ruleData(
  attributes: Partial<Record<AttributeKey, number>>,
  skills: Points[] = [],
  extra: (data: PercentileRuleData) => void = () => {},
): PercentileRuleData {
  const data = createBlankRuleData();
  for (const [key, value] of Object.entries(attributes) as [AttributeKey, number][]) {
    data.attributes[key].initial = value;
  }
  const a = (key: AttributeKey) => data.attributes[key].initial;
  data.status.hp = Math.floor((a('CON') + a('SIZ')) / 10);
  data.status.mp = Math.floor(a('POW') / 5);
  data.status.san = a('POW');
  data.status.luck = a('LUCK');
  data.skills = skills.map(([id, occupation, interest = 0]): SkillInput => ({
    id,
    occupation,
    interest,
    growth: 0,
    usedThisSession: false,
  }));
  extra(data);
  return data;
}

function character(
  id: string,
  name: string,
  occupation: string,
  tags: string[],
  data: PercentileRuleData,
  updatedAt: string,
): Character {
  return {
    id,
    ownerId: OWNER,
    name,
    occupation,
    portraitUrl: null,
    ruleSystem: 'CoC 7e',
    ruleData: data as unknown as Record<string, unknown>,
    tags,
    updatedAt,
  };
}

const average = {
  STR: 50,
  CON: 50,
  DEX: 50,
  APP: 50,
  POW: 50,
  INT: 60,
  SIZ: 55,
  EDU: 60,
  LUCK: 50,
};

export const mockCharacters: Character[] = [
  character(
    'char-shen',
    '沈映月',
    '音樂家',
    ['1920s', '霧港', '鋼琴'],
    ruleData(
      { STR: 45, CON: 60, DEX: 70, APP: 75, POW: 65, INT: 80, SIZ: 50, EDU: 70, LUCK: 55 },
      [
        ['credit-rating', 20],
        ['charm', 30],
        ['persuade', 20],
        ['psychology', 40],
        ['other-language-1', 20],
        ['history', 20],
        ['listen', 30],
        ['craft-1', 60],
        ['sleight-of-hand', 0, 20],
        ['stealth', 0, 20],
        ['handgun', 0, 10],
        ['occult', 0, 10],
      ],
      (data) => {
        data.identity = {
          ...data.identity,
          playerName: 'Ling',
          fileNumber: '047',
          createdDate: '1925.10.07',
          occupationDetail: '鋼琴師',
          education: '東京音樂學校 鋼琴科',
          era: '1920s · 霧港',
          gender: '女',
          age: 28,
          birthplace: '上海',
          residence: '霧港',
          appearance:
            '黑色長髮常以銀簪挽起，眼角有一顆淚痣。\n總穿深紫色旗袍，外罩一件駝色舊大衣。\n左手戴舊銀戒，指尖有長年練琴的薄繭。',
        };
        data.skills.push({
          id: 'native-language',
          occupation: 0,
          interest: 0,
          growth: 0,
          usedThisSession: false,
          customName: '中文',
        });
        const japanese = data.skills.find((skill) => skill.id === 'other-language-1');
        if (japanese) japanese.customName = '日文';
        const piano = data.skills.find((skill) => skill.id === 'craft-1');
        if (piano) piano.customName = '鋼琴';
        data.weapons = [
          {
            name: '鬥毆',
            skillId: 'brawl',
            damage: '1D3+DB',
            range: '近身',
            uses: '1',
            ammo: '-',
            malfunction: '-',
          },
          {
            name: '自動手槍',
            skillId: 'handgun',
            damage: '1D8',
            range: '15',
            uses: '1(3)',
            ammo: '8',
            malfunction: '99',
          },
        ];
        data.belongings = '懷錶（停在十一點十二分）\n樂譜夾、鋼筆、手帕\n旅館鑰匙 302 號房';
        data.backstory = {
          ...data.backstory,
          beliefs: '音樂能讓死者安息。',
          significantPeople: '失蹤的師父——鋼琴家葉先生。',
          meaningfulLocations: '霧港碼頭旁的老琴行。',
          treasuredPossessions: '師父留下的銀戒。',
          traits: '習慣在緊張時輕敲手指，像在彈琴。',
          story:
            '十六歲隨師父赴東京學琴，歸國後在金雀酒店駐唱。師父失蹤那晚，琴房裡只留下一張寫滿陌生音符的樂譜。',
        };
        data.record.relations = [
          { character: '陸秋白', player: '玩家 A', relation: '酒店常客，似乎知道師父的下落' },
        ];
      },
    ),
    '2026-11-22T13:30:00Z',
  ),
  character(
    sampleCharacter.id,
    sampleCharacter.name,
    sampleCharacter.occupation,
    ['現代', '地質學', '搜查'],
    ruleData({ ...average, EDU: 75, INT: 70 }, [
      ['archaeology', 50],
      ['history', 40],
      ['library-use', 40],
      ['spot-hidden', 30],
      ['geology', 0, 30],
    ]),
    '2026-11-21T09:00:00Z',
  ),
  character(
    'char-banana',
    '芭娜娜',
    '傭兵',
    ['現代', '格鬥', '武器'],
    ruleData({ ...average, STR: 75, CON: 70, DEX: 65 }, [
      ['brawl', 40],
      ['rifle', 40],
      ['dodge', 20],
    ]),
    '2026-11-20T09:00:00Z',
  ),
  character(
    'char-guaba',
    '瓜拔',
    '修女',
    ['現代', '靈異學', '神學'],
    ruleData({ ...average, POW: 75, EDU: 70 }, [
      ['occult', 40],
      ['psychology', 30],
      ['first-aid', 30],
    ]),
    '2026-11-19T09:00:00Z',
  ),
  character(
    'char-grandma',
    '阿婆',
    '小說家',
    ['現代', '說服', '威脅'],
    ruleData({ ...average, APP: 40, INT: 75, EDU: 80 }, [
      ['persuade', 40],
      ['intimidate', 30],
      ['library-use', 30],
    ]),
    '2026-11-18T09:00:00Z',
  ),
  character(
    'char-papaya',
    '爬爬牙',
    '警察',
    ['90年', '刑偵', '搜查'],
    ruleData({ ...average, STR: 65, DEX: 60 }, [
      ['handgun', 40],
      ['spot-hidden', 30],
      ['law', 30],
      ['intimidate', 20],
    ]),
    '2026-11-17T09:00:00Z',
  ),
  character(
    'char-botato',
    '波太透',
    '新聞記者',
    ['現代', '採訪'],
    ruleData({ ...average, APP: 60, EDU: 70 }, [
      ['fast-talk', 40],
      ['spot-hidden', 30],
      ['library-use', 30],
    ]),
    '2026-11-16T09:00:00Z',
  ),
  character(
    'char-bulu',
    '補路貝瑞',
    '私家偵探',
    ['1920s', '跟蹤'],
    ruleData({ ...average, DEX: 65 }, [
      ['stealth', 40],
      ['spot-hidden', 40],
      ['track', 30],
    ]),
    '2026-11-15T09:00:00Z',
  ),
  character(
    'char-mist',
    '霧島澄',
    '醫生',
    ['現代', '醫療'],
    ruleData({ ...average, INT: 75, EDU: 85 }, [
      ['medicine', 50],
      ['first-aid', 40],
      ['psychology', 30],
    ]),
    '2026-11-14T09:00:00Z',
  ),
  character(
    'char-lu',
    '陸秋白',
    '古董商',
    ['1920s', '鑑定'],
    ruleData({ ...average, APP: 65, EDU: 70 }, [
      ['appraise', 50],
      ['history', 40],
      ['charm', 30],
    ]),
    '2026-11-13T09:00:00Z',
  ),
];
