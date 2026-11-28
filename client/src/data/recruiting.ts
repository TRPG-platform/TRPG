import { dataSource, readData } from './index';

// 首頁「近期開團」的資料（home-and-join-room / home-page「Upcoming recruiting games」）。
// 正式版由 GET /api/rooms/recruiting?sort=<created|scheduled> 在伺服器端篩選、排序，前端照順序顯示。
// 筆數不設上限（團隊決定，規格原本是最多 4 張），首頁橫向捲動。

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
  /** 開團（遊玩）時間，ISO 8601。 */
  scheduledAt: string;
  /** 房間建立時間，ISO 8601。 */
  createdAt: string;
  joinedCount: number;
  maxPlayers: number;
  /** 卡片右下角的分類標籤，例如 新手友善。 */
  tag: string | null;
}

/** 排序方式：created = 建立時間，最新在前；scheduled = 開團時間，最近在前。 */
export type RecruitingSort = 'created' | 'scheduled';

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
    createdDaysAgo: number,
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
    createdAt: daysFromNow(-createdDaysAgo, 12),
    joinedCount: joined,
    maxPlayers: players[1],
    tag,
    isPublic: true,
    status: 'waiting',
    ...extra,
  });

  // 參數：代碼、名稱、規則、玩法、人數、幾天後開團、幾天前建立、已加入人數、標籤
  return [
    // 設計稿 TV-2 的三張（開團時間：霧都最早、洋館次之、失落的文明最晚）
    room('Y7G2K4', '【新手友善】洋詭異人館', 'CoC 7e', '文字團', [3, 5], 2, 4, 3, '新手友善'),
    room('L3W8N6', '失落的文明', 'CoC 6e', '文字團', [3, 4], 3, 1, 3, '長期團'),
    room('F5D9R1', '霧都。追跡。', 'CoC 7e', '劇情向', [5, 7], 1, 6, 5, '長期團'),
    room('A7F3K9', '夜行的圖書館', 'CoC 7e', '文字團', [4, 6], 5, 0, 2, '新手友善'),
    room('M2P6Q8', '海底的觀測者', 'CoC 7e', '劇情向', [2, 4], 9, 2, 1, null),
    room('K9R4W7', '玻璃溫室的花', 'CoC 7e', '文字團', [3, 4], 7, 3, 1, '新手友善'),
    room('Q1Z8X3', '雨夜的電話亭', 'CoC 7e', '劇情向', [2, 3], 12, 5, 0, null),
    // 以下都不應該出現：私人、已開始、開團時間已過
    room('S4H7T2', '白雪之下', 'CoC 7e', '文字團', [3, 5], 4, 1, 2, null, { isPublic: false }),
    room('B8C1V5', '最後的舞台', 'CoC 7e', '劇情向', [3, 5], 6, 2, 5, null, { status: 'playing' }),
    room('E6J3U9', '終點站的來信', 'CoC 7e', '文字團', [3, 5], -1, 8, 4, null),
  ];
}

/**
 * 依規格篩選：公開、等待中、開團時間在未來；不限筆數。
 * 排序：created = 建立時間最新在前；scheduled = 開團時間最近在前。
 */
export function pickRecruiting(
  rooms: MockRoom[],
  sort: RecruitingSort,
  now = Date.now(),
): RecruitingRoom[] {
  return rooms
    .filter(
      (room) => room.isPublic && room.status === 'waiting' && Date.parse(room.scheduledAt) > now,
    )
    .sort((a, b) =>
      sort === 'created'
        ? Date.parse(b.createdAt) - Date.parse(a.createdAt)
        : Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt),
    );
}

export function getRecruitingRooms(
  sort: RecruitingSort,
  signal?: AbortSignal,
): Promise<RecruitingRoom[]> {
  return readData(
    `/api/rooms/recruiting?sort=${sort}`,
    () => {
      // 驗收用：網址加 ?recruiting=empty 可以看到「目前沒有開團」的畫面
      if (
        dataSource === 'mock' &&
        new URLSearchParams(window.location.search).get('recruiting') === 'empty'
      ) {
        return [];
      }
      return pickRecruiting(mockRooms(), sort);
    },
    signal,
  );
}
