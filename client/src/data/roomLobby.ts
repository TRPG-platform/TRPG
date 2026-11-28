import type { Character, Room, Script, User } from '@takoyaki/shared';
import { readData } from './index';

// 房間大廳（room-lobby，TV-5／TV-6）的資料。
// 正式版由 GET /api/rooms/:id/state 回傳完整房間狀態（room-realtime「Server-authoritative state with versions」）。
// TODO(room-lobby 3.1)：串接時確認網址用房間 id 還是房號，並改接即時事件。

type RoomMember = Room['members'][number];

/** 大廳成員：房間成員狀態，加上顯示用的使用者名稱與頭像。 */
export type LobbyMember = RoomMember & Pick<User, 'displayName' | 'avatarUrl'>;

/** GM 公告（room-lobby「GM announcement」）：最多 1000 字純文字，加上選填的團務須知連結。 */
export interface LobbyAnnouncement {
  body: string;
  /** ISO 8601，最後編輯時間。 */
  updatedAt: string;
  guideUrl: string | null;
}

/** 房間大廳畫面需要的完整狀態。 */
export interface RoomLobbyState {
  room: Omit<Room, 'members'> & { members: LobbyMember[] };
  script: Script;
  /** 目前登入的使用者。 */
  currentUserId: string;
  announcement: LobbyAnnouncement | null;
  /** 規則全名，例如 Call of Cthulhu。TODO：之後改由規則模組提供。 */
  ruleName: string;
  /** 玩法，例如 文字團。TODO：shared 的 Script 目前沒有這個欄位，串接時確認來源。 */
  playStyle: string;
}

const updatedAt = '2026-11-12T10:32:00Z';

const mockScript: Script = {
  id: 'script-night-library',
  ownerId: 'user-gm',
  title: '夜行的圖書館',
  coverUrl: null,
  ruleSystem: 'CoC 7e',
  playerMin: 3,
  playerMax: 5,
  sceneCount: 6,
  estimatedHoursMin: 4,
  estimatedHoursMax: 6,
  tags: ['新手友善', '恐怖', '調查'],
  synopsis: '在沉寂的深夜，圖書館的燈再度亮起。塵封的書頁中，究竟藏著什麼不該被翻開的真相……？',
  status: 'completed',
  updatedAt,
};

const mockRoomLobby: RoomLobbyState = {
  room: {
    id: 'room-a7f3k9',
    roomCode: 'A7F3K9',
    gmId: 'user-gm',
    scriptId: mockScript.id,
    ruleSystem: mockScript.ruleSystem,
    maxPlayers: 5,
    // 台灣時間 2026-11-21（六）20:00
    scheduledAt: '2026-11-21T12:00:00Z',
    status: 'waiting',
    settings: {
      disallowExistingCharacters: true,
      disallowPlayerUploads: true,
      allowGmToPlayerWhispers: true,
      allowPlayerToPlayerWhispers: true,
      enableEffects: true,
    },
    members: [
      {
        userId: 'user-gm',
        displayName: '投沒透',
        avatarUrl: null,
        characterId: null,
        isReady: false,
        isOnline: true,
      },
      {
        userId: 'user-pl-1',
        displayName: '波太透',
        avatarUrl: null,
        characterId: 'character-1',
        isReady: true,
        isOnline: true,
      },
      {
        userId: 'user-pl-2',
        displayName: '斯卓貝瑞',
        avatarUrl: null,
        characterId: 'character-2',
        isReady: true,
        isOnline: true,
      },
      {
        userId: 'user-pl-3',
        displayName: '補路貝瑞',
        avatarUrl: null,
        characterId: 'character-3',
        isReady: true,
        isOnline: true,
      },
      {
        userId: 'user-pl-4',
        displayName: '藍莓派',
        avatarUrl: null,
        characterId: 'character-4',
        isReady: true,
        isOnline: true,
      },
    ],
  },
  script: mockScript,
  currentUserId: 'user-gm',
  announcement: {
    body: [
      '各位好！',
      '這將是一場 CoC 7 版的文字團，預計 11/21（六）20:00 開始。',
      '',
      '開團前的小小準備',
      '',
      '01  確認角色卡與背景故事',
      '02  閱讀團務須知和安全共識',
      '03  準備耳機、點心和飲料',
    ].join('\n'),
    // 台灣時間 11/12 18:32
    updatedAt: '2026-11-12T10:32:00Z',
    // TODO：團務須知頁面完成後換成實際網址
    guideUrl: '/guide',
  },
  ruleName: 'Call of Cthulhu',
  playStyle: '文字團',
};

/** 假資料模式下要模擬哪一種視角。正式版由伺服器依登入身分回傳，不需要這個參數。 */
export type MockViewer = 'gm' | 'pl';

/** PL 視角（TV-5）：目前使用者是第 4 位玩家，已經選了斯卓貝瑞但還沒準備。 */
const MOCK_PL_USER_ID = 'user-pl-4';

export function getRoomLobby(
  roomCode: string,
  signal?: AbortSignal,
  mockViewer: MockViewer = 'gm',
): Promise<RoomLobbyState> {
  return readData(
    `/api/rooms/${encodeURIComponent(roomCode)}/state`,
    () => {
      const lobby = structuredClone(mockRoomLobby);
      lobby.room.roomCode = roomCode;
      if (mockViewer === 'pl') {
        lobby.currentUserId = MOCK_PL_USER_ID;
        const me = lobby.room.members.find((member) => member.userId === MOCK_PL_USER_ID);
        // 剛進房間的 PL 還沒選角色
        if (me) Object.assign(me, { characterId: null, isReady: false });
      }
      return lobby;
    },
    signal,
  );
}

/**
 * 大廳角色選擇用的角色摘要。
 * TODO(#18)：Ling 的百分骰規則型別（PercentileRuleData）合併後，HP、SAN、簡介改從 Character.ruleData 計算。
 */
export type LobbyCharacter = Pick<Character, 'id' | 'name' | 'occupation' | 'portraitUrl'> & {
  hp: number;
  hpMax: number;
  san: number;
  sanMax: number;
  summary: string;
};

const mockMyCharacters: LobbyCharacter[] = [
  {
    id: 'character-strawberry',
    name: '斯卓貝瑞',
    occupation: '考古學家',
    portraitUrl: null,
    hp: 50,
    hpMax: 50,
    san: 70,
    sanMax: 73,
    summary:
      '身高162公分，21歲，大學生，專攻考古學。\n\n對於古書與失落文明有著近乎執著的熱情，隨身攜帶考古學教授留給自己的羊皮筆記本，上頭記錄了教授過去曾親眼見到的失落遺跡。',
  },
  {
    id: 'character-banana',
    name: '芭娜娜',
    occupation: '傭兵',
    portraitUrl: null,
    hp: 73,
    hpMax: 82,
    san: 63,
    sanMax: 70,
    summary:
      '身高182公分，29歲，職業雇傭兵。\n人狠話不多，能神不知鬼不覺的抹掉目標的脖子，在三年前，他的師父，人稱雇傭兵界的二把手，成為了他人的目標，死在了那個雨夜，從此，他不再接受委託，決心為復仇而活。',
  },
  {
    id: 'character-granny',
    name: '阿婆',
    occupation: '小說家',
    portraitUrl: null,
    hp: 49,
    hpMax: 54,
    san: 71,
    sanMax: 75,
    summary:
      '身高179公分，27歲，沒什麼代表作的三流小說家。\n在他出道之際，手握好作品的他本來能有大紅大紫的機會，卻因為出版社內部操作，他的作品出版了，卻掛了其他作家的名字。',
  },
  {
    id: 'character-crawler',
    name: '爬爬牙',
    occupation: '警察',
    portraitUrl: null,
    hp: 65,
    hpMax: 65,
    san: 40,
    sanMax: 40,
    summary:
      '身高185公分，34歲，重案組組長，因為被記了處分正在被迫休假。\n體格異常的好，在警署是泰山一樣的存在，卻也因為他衝動的個性，終究是犯下了不可挽回的錯誤。',
  },
];

/** 目前使用者的角色清單（角色庫分頁）。TODO(character-card)：確認正式 API 網址。 */
export function getMyLobbyCharacters(signal?: AbortSignal): Promise<LobbyCharacter[]> {
  return readData('/api/characters', () => structuredClone(mockMyCharacters), signal);
}
