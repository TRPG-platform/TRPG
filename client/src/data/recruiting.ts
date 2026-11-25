import { dataSource, readData } from './index';

// 首頁「近期開團」的資料（home-and-join-room / home-page「Upcoming recruiting games」）。
// 正式版由 GET /api/rooms/recruiting 在伺服器端篩選、排序、限制筆數，前端照順序顯示。

/** 近期開團卡片需要的欄位（GET /api/rooms/recruiting 的回應格式）。 */
export interface RecruitingRoom {
  roomId: string;
  roomCode: string;
  title: string;
  coverUrl: string | null;
  /** 規則標籤，例如 CoC 7e。 */
  ruleLabel: string;
  /** 玩法，例如 文字團、劇情向。 */
  playStyle: string;
  playerMin: number;
  playerMax: number;
  /** ISO 8601。 */
  scheduledAt: string;
  joinedCount: number;
  maxPlayers: number;
  /** 卡片右下角的分類標籤，例如 新手友善。 */
  tag: string | null;
}

export const RECRUITING_LIMIT = 4;

/** 假資料：多放幾個不該出現的房間，用來確認篩選規則。 */
interface MockRoom extends RecruitingRoom {
  isPublic: boolean;
  status: 'waiting' | 'playing' | 'ended';
}

/** 今天起第 days 天的 20:00（假資料用相對日期，才不會過期）。 */
function daysFromNow(days: number, hour = 20): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function mockRooms(): MockRoom[] {
  const room = (
    roomCode: string,
    title: string,
    ruleLabel: string,
    playStyle: string,
    players: [number, number],
    days: number,
    joined: number,
    tag: string | null,
    extra: Partial<MockRoom> = {},
  ): MockRoom => ({
    roomId: `room-${roomCode}`,
    roomCode,
    title,
    coverUrl: null,
    ruleLabel,
    playStyle,
    playerMin: players[0],
    playerMax: players[1],
    scheduledAt: daysFromNow(days),
    joinedCount: joined,
    maxPlayers: players[1],
    tag,
    isPublic: true,
    status: 'waiting',
    ...extra,
  });

  return [
    // 設計稿 TV-2 的三張（順序依規格範例：霧都最早、洋館次之、失落的文明最晚）
    room('Y7G2K4', '【新手友善】洋詭異人館', 'CoC 7e', '文字團', [3, 5], 2, 3, '新手友善'),
    room('L3W8N6', '失落的文明', 'CoC 6e', '文字團', [3, 4], 3, 3, '長期團'),
    room('F5D9R1', '霧都。追跡。', 'CoC 7e', '劇情向', [5, 7], 1, 5, '長期團'),
    room('A7F3K9', '夜行的圖書館', 'CoC 7e', '文字團', [4, 6], 5, 2, '新手友善'),
    // 第 5 個公開房間：最晚開團，超過 4 張的上限，不應該出現
    room('M2P6Q8', '海底的觀測者', 'CoC 7e', '劇情向', [2, 4], 9, 1, null),
    // 以下都不應該出現：私人、已開始、開團時間已過
    room('S4H7T2', '白雪之下', 'CoC 7e', '文字團', [3, 5], 4, 2, null, { isPublic: false }),
    room('B8C1V5', '最後的舞台', 'CoC 7e', '劇情向', [3, 5], 6, 5, null, { status: 'playing' }),
    room('E6J3U9', '終點站的來信', 'CoC 7e', '文字團', [3, 5], -1, 4, null),
  ];
}

/** 依規格篩選：公開、等待中、開團時間在未來；依開團時間由近到遠，最多 4 筆。 */
export function pickRecruiting(rooms: MockRoom[], now = Date.now()): RecruitingRoom[] {
  return rooms
    .filter(
      (room) => room.isPublic && room.status === 'waiting' && Date.parse(room.scheduledAt) > now,
    )
    .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt))
    .slice(0, RECRUITING_LIMIT);
}

export function getRecruitingRooms(signal?: AbortSignal): Promise<RecruitingRoom[]> {
  return readData(
    '/api/rooms/recruiting',
    () => {
      // 驗收用：網址加 ?recruiting=empty 可以看到「目前沒有開團」的畫面
      if (
        dataSource === 'mock' &&
        new URLSearchParams(window.location.search).get('recruiting') === 'empty'
      ) {
        return [];
      }
      return pickRecruiting(mockRooms());
    },
    signal,
  );
}
