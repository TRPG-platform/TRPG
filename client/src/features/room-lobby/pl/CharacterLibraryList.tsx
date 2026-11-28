import type { LobbyCharacter } from '../../../data/roomLobby';
import './CharacterLibraryList.css';

// 「角色庫」分頁：列出自己的角色，點一下就選定為本次使用的角色。
// GM 開啟「禁止PL使用既有角色」時，既有角色全部反黑不能選，只有在大廳新建的角色可以選。

interface CharacterLibraryListProps {
  characters: LobbyCharacter[];
  selectedId: string | null;
  /** GM 開啟「禁止PL使用既有角色」。 */
  isExistingDisallowed: boolean;
  /** 在這個大廳裡新建的角色，禁止既有角色時仍可選。 */
  newCharacterIds: string[];
  onSelect: (characterId: string) => void;
}

export default function CharacterLibraryList({
  characters,
  selectedId,
  isExistingDisallowed,
  newCharacterIds,
  onSelect,
}: CharacterLibraryListProps) {
  return (
    <>
      {/* TODO：角色和成員都有建立／加入時間後，改用時間判斷哪些是加入房間後才建立的角色 */}
      {isExistingDisallowed && (
        <p className="character-library__notice">
          GM 已禁止使用既有角色，請按「建立新角色」新增本次使用的角色
        </p>
      )}

      {characters.length === 0 ? (
        <p className="character-library__empty">還沒有角色，請先建立新角色。</p>
      ) : (
        <ul className="character-library">
          {characters.map((character) => {
            const isSelected = character.id === selectedId;
            const isLocked = isExistingDisallowed && !newCharacterIds.includes(character.id);
            return (
              <li key={character.id}>
                <button
                  type="button"
                  className="character-library__item"
                  aria-pressed={isSelected}
                  disabled={isLocked}
                  title={isLocked ? 'GM 已禁止使用既有角色' : undefined}
                  onClick={() => onSelect(character.id)}
                >
                  {character.portraitUrl ? (
                    <img
                      className="character-library__portrait"
                      src={character.portraitUrl}
                      alt=""
                    />
                  ) : (
                    <span className="character-library__portrait" aria-hidden="true" />
                  )}
                  <span className="character-library__info">
                    <span className="character-library__name">{character.name}</span>
                    <span className="character-library__occupation">{character.occupation}</span>
                    <span className="character-library__stats">
                      <span className="character-library__stat">
                        HP {character.hp}/{character.hpMax}
                      </span>
                      <span className="character-library__stat">
                        SAN {character.san}/{character.sanMax}
                      </span>
                    </span>
                  </span>
                  {isSelected && <span className="character-library__selected">使用中</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
