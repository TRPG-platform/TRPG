import { sampleCharacter, sampleRoom } from './mock';

const sampleSkills = [
  ['圖書館使用', 70],
  ['聆聽', 50],
  ['心理學', 60],
  ['偵查', 65],
  ['歷史', 65],
] as const;

export function createGameRoomPreview() {
  return {
    room: {
      ...structuredClone(sampleRoom),
      status: 'playing' as const,
      settings: { ...sampleRoom.settings, disallowPlayerUploads: true },
    },
    character: structuredClone(sampleCharacter),
    scene: '夜晚的圖書館',
    players: [
      {
        name: '切裡',
        occupation: '藝術家',
        hp: '11/12',
        san: '61/70',
        values: [45, 65, 60, 65, 70, 60, 50, 65, 55],
        skills: [
          ['藝術與工藝', 70],
          ['偵查', 55],
          ['心理學', 45],
        ] as const,
      },
      {
        ...sampleCharacter,
        hp: '50/50',
        san: '70/73',
        values: [50, 55, 60, 70, 65, 70, 50, 75, 70],
        skills: sampleSkills,
      },
      {
        name: '補路貝瑞',
        occupation: '歌手',
        hp: '10/10',
        san: '56/60',
        values: [40, 70, 50, 65, 75, 60, 50, 60, 65],
        skills: [
          ['演唱', 75],
          ['聆聽', 60],
          ['魅力', 55],
        ] as const,
      },
      {
        name: '波太透',
        occupation: '軍醫',
        hp: '12/13',
        san: '65/70',
        values: [60, 55, 65, 70, 50, 65, 65, 75, 55],
        skills: [
          ['醫學', 75],
          ['急救', 70],
          ['偵查', 50],
        ] as const,
      },
    ].map(({ name, occupation, hp, san, values, skills }) => ({
      name,
      occupation,
      hp,
      san,
      skills,
      attributes: ['STR', 'DEX', 'CON', 'INT', 'APP', 'POW', 'SIZ', 'EDU', '幸運'].map(
        (label, index) => [label, values[index]] as const,
      ),
    })),
    stats: {
      hp: '50/50',
      san: '70/73',
      attributes: [
        ['STR', 50],
        ['DEX', 55],
        ['CON', 60],
        ['INT', 70],
        ['APP', 65],
        ['POW', 70],
        ['SIZ', 50],
        ['EDU', 75],
        ['幸運', 70],
      ] as const,
      skills: sampleSkills,
    },
    rolls: ['1D100 ≤ 75 → 34　成功', '1D100 ≤ 60 → 88　失敗'],
    clues: ['圖書館的借閱紀錄', '破損書頁（疑似儀式）'],
  };
}

export type GameRoomPreview = ReturnType<typeof createGameRoomPreview>;
