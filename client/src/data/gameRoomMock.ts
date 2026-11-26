import { sampleCharacter, sampleRoom } from './mock';

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
      { name: '切裡', occupation: '藝術家' },
      sampleCharacter,
      { name: '補路貝瑞', occupation: '歌手' },
      { name: '波太透', occupation: '軍醫' },
    ].map(({ name, occupation }) => ({ name, occupation })),
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
      skills: [
        ['圖書館使用', 70],
        ['聆聽', 50],
        ['心理學', 60],
        ['偵查', 65],
        ['歷史', 65],
      ] as const,
    },
    rolls: ['1D100 ≤ 75 → 34　成功', '1D100 ≤ 60 → 88　失敗'],
    clues: ['圖書館的借閱紀錄', '破損書頁（疑似儀式）'],
  };
}

export type GameRoomPreview = ReturnType<typeof createGameRoomPreview>;
