import type { LobbyCharacter } from '../../../data/roomLobby';
import LobbyIcon from '../components/LobbyIcon';
import './CharacterSummaryCard.css';

// 「我的角色」分頁：本次選擇的角色摘要，只能看（room-lobby「Choose a character for this game」）。

interface CharacterSummaryCardProps {
  character: LobbyCharacter;
}

export default function CharacterSummaryCard({ character }: CharacterSummaryCardProps) {
  return (
    <article className="character-summary" aria-labelledby="character-summary-name">
      <div className="character-summary__head">
        {character.portraitUrl ? (
          <img className="character-summary__portrait" src={character.portraitUrl} alt="" />
        ) : (
          <span className="character-summary__portrait" aria-hidden="true" />
        )}
        <div>
          <h3 id="character-summary-name" className="character-summary__name">
            {character.name}
          </h3>
          <p className="character-summary__occupation">{character.occupation}</p>
        </div>
      </div>

      <ul className="character-summary__stats" aria-label="角色狀態">
        <li className="character-summary__stat">
          <LobbyIcon name="heart" size={14} className="character-summary__hp-icon" />
          HP {character.hp}/{character.hpMax}
        </li>
        <li className="character-summary__stat">
          <LobbyIcon name="brain" size={14} className="character-summary__san-icon" />
          SAN {character.san}/{character.sanMax}
        </li>
      </ul>

      <div className="character-summary__profile">
        <h4 className="character-summary__profile-title">簡介</h4>
        <p className="character-summary__summary">{character.summary}</p>
        <p className="character-summary__selected">已選擇該角色</p>
      </div>
    </article>
  );
}
