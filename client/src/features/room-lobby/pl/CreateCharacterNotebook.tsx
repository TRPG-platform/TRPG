import { deriveSheet, normalizeRuleData, type Character } from '@takoyaki/shared';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ConfirmDialog from '../../../components/ConfirmDialog';
import notebookImage from '../../../assets/notebook.webp';
import { createCharacter, deleteCharacter, saveCharacter } from '../../../data/characters';
import type { LobbyCharacter } from '../../../data/roomLobby';
import { toChanges, toDraft, type Draft, type UpdateDraft } from '../../characters/draft';
import IdentityTab from '../../characters/IdentityTab';
import SkillsTab from '../../characters/SkillsTab';
import StatsTab from '../../characters/StatsTab';
import { BackgroundTab, EquipmentTab, RecordTab } from '../../characters/StoryTabs';
import '../../characters/CharactersPage.css';
import './CreateCharacterNotebook.css';

// PL 大廳「建立新角色」：用彈窗開啟「我的角色」的筆記本（character-card），
// 直接取用翎的分頁元件與樣式，只換掉外殼：
// - 沒有「調查員」總覽、搜尋、刪除
// - 「確定新增」後存檔，並設為本次房間使用的角色
// - 取消或關閉時，取消新增（刪掉剛建立的角色）
// 筆記本 1929×1054 的固定尺寸與縮放方式和 CharactersPage 相同。
// TODO：翎抽出共用的 CharacterNotebook 後，改用共用元件，拿掉這裡重複的縮放與分頁列。

const STAGE_WIDTH = 1929;
const STAGE_HEIGHT = 1054;

const TABS = [
  { id: 'identity', label: '身分' },
  { id: 'stats', label: '數值' },
  { id: 'skills1', label: '技能一' },
  { id: 'skills2', label: '技能二' },
  { id: 'equipment', label: '裝備' },
  { id: 'background', label: '背景' },
  { id: 'record', label: '紀錄' },
] as const;
type TabId = (typeof TABS)[number]['id'];

/** 角色卡轉成大廳用的角色摘要（HP／SAN 上限由規則模組計算）。 */
function toLobbyCharacter(character: Character): LobbyCharacter {
  const data = normalizeRuleData(character.ruleData);
  const { maximums } = deriveSheet(data, character.occupation);
  return {
    id: character.id,
    name: character.name,
    occupation: character.occupation,
    portraitUrl: character.portraitUrl,
    hp: data.status.hp,
    hpMax: maximums.hp,
    san: data.status.san,
    sanMax: maximums.san,
    summary: data.backstory.intro || data.backstory.story,
  };
}

function useStageScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const style = getComputedStyle(element);
      const width =
        element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height =
        element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      setScale(Math.max(0.2, Math.min(width / STAGE_WIDTH, height / STAGE_HEIGHT)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, scale };
}

interface CreateCharacterNotebookProps {
  /** 按「確定新增」存檔成功後呼叫，傳回大廳用的角色摘要。 */
  onCreated: (character: LobbyCharacter) => void;
  /** 取消新增、關閉彈窗。 */
  onClose: () => void;
}

export default function CreateCharacterNotebook({
  onCreated,
  onClose,
}: CreateCharacterNotebookProps) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [tab, setTab] = useState<TabId>('identity');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const { ref: fitRef, scale } = useStageScale();

  // 開啟時先建立一個「未命名調查員」（和我的角色頁「新增調查員」相同流程）。
  // 還沒按「確定新增」就關閉，會刪掉這個角色。
  const createdIdRef = useRef<string | null>(null);
  const isConfirmedRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;
    createCharacter()
      .then((created) => {
        if (isCancelled) {
          void deleteCharacter(created.id).catch(() => undefined);
          return;
        }
        createdIdRef.current = created.id;
        setDraft(toDraft(created));
      })
      .catch(() => {
        if (!isCancelled) setError('建立角色失敗，請關閉後再試一次。');
      });
    return () => {
      isCancelled = true;
      const id = createdIdRef.current;
      if (id && !isConfirmedRef.current) void deleteCharacter(id).catch(() => undefined);
    };
  }, []);

  const update: UpdateDraft = useCallback((recipe) => {
    setDraft((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      recipe(next);
      return next;
    });
  }, []);

  const derived = useMemo(
    () => (draft ? deriveSheet(draft.data, draft.occupation) : null),
    [draft],
  );

  const confirmCreate = async () => {
    if (!draft) return;
    setIsSaving(true);
    setError('');
    try {
      const saved = await saveCharacter(draft.id, toChanges(draft));
      isConfirmedRef.current = true;
      onCreated(toLobbyCharacter(saved));
    } catch {
      setError('存檔失敗，請再按一次確定新增。');
      setIsSaving(false);
    }
  };

  /** 按「取消」或 Esc：一律先跳共用確認視窗「確定取消新增？」。 */
  const requestClose = useCallback(() => {
    if (isSaving) return;
    setIsLeaving(true);
  }, [isSaving]);

  // Esc 等同按「取消」；確認視窗開著時交給 ConfirmDialog 處理（Esc = 繼續編輯）。
  useEffect(() => {
    if (isLeaving) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLeaving, requestClose]);

  const renderTab = () => {
    if (!draft || !derived) {
      return <p className="sheet__page sheet__note">{error || '準備筆記本中…'}</p>;
    }
    switch (tab) {
      case 'identity':
        return <IdentityTab draft={draft} update={update} />;
      case 'stats':
        return <StatsTab draft={draft} derived={derived} update={update} />;
      case 'skills1':
      case 'skills2':
        return <SkillsTab key={tab} page={tab} draft={draft} derived={derived} update={update} />;
      case 'equipment':
        return <EquipmentTab draft={draft} derived={derived} update={update} />;
      case 'background':
        return <BackgroundTab draft={draft} update={update} />;
      case 'record':
        return <RecordTab draft={draft} update={update} />;
    }
  };

  const subtitle = draft
    ? `— ${draft.name || '未命名調查員'}${draft.occupation ? `（${draft.occupation}）` : ''}`
    : '';

  return (
    <div
      className="create-notebook"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-notebook-title"
    >
      {/* .characters 帶有筆記本的紙張用色與字型變數 */}
      <div className="create-notebook__window characters">
        <header className="characters__top create-notebook__top">
          <h2 id="create-notebook-title" className="characters__title">
            建立新角色 <small>{subtitle}</small>
          </h2>
          <div className="characters__actions">
            <span className="characters__save-state" role="status">
              {isSaving ? '存檔中…' : error && draft ? error : '新增後會設為本次使用的角色'}
            </span>
            <button
              type="button"
              className="characters__button characters__button--primary"
              disabled={!draft || isSaving}
              onClick={() => void confirmCreate()}
            >
              確定新增
            </button>
            <button
              type="button"
              className="characters__button"
              disabled={isSaving}
              onClick={requestClose}
            >
              取消
            </button>
          </div>
        </header>

        <div className="characters__fit" ref={fitRef}>
          <div
            className="characters__frame"
            style={{ width: STAGE_WIDTH * scale, height: STAGE_HEIGHT * scale }}
          >
            <div className="characters__stage" style={{ transform: `scale(${scale})` }}>
              <div className="notebook" style={{ backgroundImage: `url(${notebookImage})` }}>
                <div className="sheet" role="tabpanel" id={`create-notebook-panel-${tab}`}>
                  {renderTab()}
                </div>
              </div>
              <nav className="notebook__tabs" role="tablist" aria-label="檔案分頁">
                {TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    className="notebook__tab"
                    aria-selected={tab === id}
                    aria-controls={`create-notebook-panel-${id}`}
                    disabled={!draft}
                    onClick={() => setTab(id)}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {isLeaving && (
        <ConfirmDialog
          title="確定取消新增？"
          confirmLabel="確定取消"
          cancelLabel="繼續編輯"
          onConfirm={onClose}
          onCancel={() => setIsLeaving(false)}
        >
          這位調查員還沒按「確定新增」，取消後填寫的內容都不會保存。
        </ConfirmDialog>
      )}
    </div>
  );
}
