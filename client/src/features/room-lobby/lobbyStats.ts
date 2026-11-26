import type { LobbyMember, RoomLobbyState } from '../../data/roomLobby';

export interface LobbyStats {
  gm: LobbyMember | undefined;
  /** 不含 GM。 */
  players: LobbyMember[];
  /** GM 排第一，其餘照加入順序。 */
  sortedMembers: LobbyMember[];
  readyCount: number;
  /** 至少一位玩家，而且全部玩家都已準備（room-lobby「Start the game」）。 */
  canStart: boolean;
}

export function getLobbyStats(room: RoomLobbyState['room']): LobbyStats {
  const gm = room.members.find((member) => member.userId === room.gmId);
  const players = room.members.filter((member) => member.userId !== room.gmId);
  const readyCount = players.filter((player) => player.isReady).length;

  return {
    gm,
    players,
    sortedMembers: gm ? [gm, ...players] : players,
    readyCount,
    canStart: players.length > 0 && readyCount === players.length,
  };
}
