import type { LobbyMember } from '../../../data/roomLobby';

// 玩家列表的一列：頭像、GM／PL 標籤、名稱、在線狀態、已準備。
// 狀態不能只靠顏色區分，所以綠點旁邊附上螢幕閱讀器文字（開發注意事項第 11 節）。

interface PlayerRowProps {
  member: LobbyMember;
  isGm: boolean;
}

export default function PlayerRow({ member, isGm }: PlayerRowProps) {
  return (
    <li className="player-row">
      <span className="player-row__avatar-wrap">
        {member.avatarUrl ? (
          <img className="player-row__avatar" src={member.avatarUrl} alt="" />
        ) : (
          <span className="player-row__avatar" aria-hidden="true" />
        )}
        <span
          className={`player-row__presence${member.isOnline ? ' player-row__presence--online' : ''}`}
          aria-hidden="true"
        />
      </span>

      <span className="player-row__info">
        <span className={`player-row__badge player-row__badge--${isGm ? 'gm' : 'pl'}`}>
          {isGm ? 'GM' : 'PL'}
        </span>
        <span className="player-row__name">{member.displayName}</span>
        <span className="visually-hidden">{member.isOnline ? '，在線' : '，離線'}</span>
      </span>

      {!isGm && member.isReady && <span className="player-row__ready">已準備</span>}
    </li>
  );
}
