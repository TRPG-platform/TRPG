import type { LobbyMember } from '../../../data/roomLobby';
import PlayerRow from './PlayerRow';
import './PlayerList.css';

// 房間大廳玩家列表（room-lobby「Lobby overview」），GM 和 PL 共用。列表超過高度時可以上下滑動。

interface PlayerListProps {
  /** GM 排第一。 */
  members: LobbyMember[];
  gmId: string;
  /** 不含 GM 的玩家人數。 */
  playerCount: number;
  maxPlayers: number;
}

export default function PlayerList({ members, gmId, playerCount, maxPlayers }: PlayerListProps) {
  return (
    <section className="player-list" aria-labelledby="player-list-title">
      <h2 id="player-list-title" className="player-list__title">
        玩家（{playerCount}/{maxPlayers}）
      </h2>
      <ul className="player-list__items" tabIndex={0} aria-label="房間成員">
        {members.map((member) => (
          <PlayerRow key={member.userId} member={member} isGm={member.userId === gmId} />
        ))}
      </ul>
    </section>
  );
}
