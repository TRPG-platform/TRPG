import type { Room, Script, User } from '@takoyaki/shared';
import { readData } from './index';

// 房間大廳（room-lobby，TV-5／TV-6）的資料。
// 正式版由 GET /api/rooms/:id/state 回傳完整房間狀態（room-realtime「Server-authoritative state with versions」）。
// TODO(room-lobby 3.1)：串接時確認網址用房間 id 還是房號，並改接即時事件。

type RoomMember = Room['members'][number];

/** 大廳成員：房間成員狀態，加上顯示用的使用者名稱與頭像。 */
export type LobbyMember = RoomMember & Pick<User, 'displayName' | 'avatarUrl'>;

/** 房間大廳畫面需要的完整狀態。 */
export interface RoomLobbyState {
  room: Omit<Room, 'members'> & { members: LobbyMember[] };
  script: Script;
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
  ruleName: 'Call of Cthulhu',
  playStyle: '文字團',
};

export function getRoomLobby(roomCode: string, signal?: AbortSignal): Promise<RoomLobbyState> {
  return readData(
    `/api/rooms/${encodeURIComponent(roomCode)}/state`,
    () => {
      const lobby = structuredClone(mockRoomLobby);
      lobby.room.roomCode = roomCode;
      return lobby;
    },
    signal,
  );
}
