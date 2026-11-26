import { deriveSheet, type Character } from '@takoyaki/shared';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBlocker } from 'react-router';
import {
  createCharacter,
  deleteCharacter,
  listMyCharacters,
  saveCharacter,
} from '../../data/characters';
import notebookImage from '../../assets/notebook.webp';
import { toChanges, toDraft, type Draft, type UpdateDraft } from './draft';
import IdentityTab from './IdentityTab';
import { matchesSearch, pageCount } from './roster';
import RosterTab from './RosterTab';
import SkillsTab from './SkillsTab';
import StatsTab from './StatsTab';
import { BackgroundTab, EquipmentTab, RecordTab } from './StoryTabs';
import TopNav from '../../components/TopNav';
import './CharactersPage.css';

// 我的角色卡＋角色卡編輯器（character-card / character-sheet）。
// 筆記本以 1929×1054 的固定尺寸排版，再依視窗大小整體縮放。

const STAGE_WIDTH = 1929;
const STAGE_HEIGHT = 1054;

const TABS = [
  { id: 'roster', label: '調查員' },
  { id: 'identity', label: '身分' },
  { id: 'stats', label: '數值' },
  { id: 'skills1', label: '技能一' },
  { id: 'skills2', label: '技能二' },
  { id: 'equipment', label: '裝備' },
  { id: 'background', label: '背景' },
  { id: 'record', label: '紀錄' },
] as const;
type TabId = (typeof TABS)[number]['id'];

// 不自動存檔：只有按「確定新增／確定修改」才存。
type SaveState = 'idle' | 'saving' | 'error';
const SAVE_MESSAGES: Record<SaveState, string> = {
  idle: '',
  saving: '存檔中…',
  error: '存檔失敗，請再按一次確定',
};

/**
 * 筆記本的縮放比例。外框（.characters__fit）用 flex 撐滿導覽列與標題列以外的剩餘空間，
 * 這裡只量外框本身的內容大小；上方高度改變（字型載入、換行、加導覽列）時外框跟著變，
 * ResizeObserver 會自動重算，頁面不會多出捲動。
 */
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

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [tab, setTab] = useState<TabId>('roster');
  const [query, setQuery] = useState('');
  const [rosterPage, setRosterPage] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  // 剛按「新增調查員」建立、還沒按「確定新增」的角色 id。
  const [creatingId, setCreatingId] = useState<string | null>(null);
  // 有沒有還沒按確定的修改。
  const [dirty, setDirty] = useState(false);
  // 「確定離開？」確認框（返回鍵、調查員分頁）；導覽列連結被擋下時看 blocker.state。
  const [leaving, setLeaving] = useState<'roster' | null>(null);
  const { ref: fitRef, scale } = useStageScale();

  const draftRef = useRef<Draft | null>(null);
  draftRef.current = draft;

  useEffect(() => {
    const controller = new AbortController();
    listMyCharacters(controller.signal)
      .then(setCharacters)
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setLoadError(error instanceof Error ? error.message : '讀取角色失敗');
      });
    return () => controller.abort();
  }, []);

  const update: UpdateDraft = useCallback((recipe) => {
    setDirty(true);
    setDraft((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      recipe(next);
      return next;
    });
  }, []);

  /** 存檔目前的草稿，成功回傳 true。 */
  const persist = async (): Promise<boolean> => {
    const current = draftRef.current;
    if (!current) return true;
    setSaveState('saving');
    try {
      const saved = await saveCharacter(current.id, toChanges(current));
      setCharacters((list) => list?.map((item) => (item.id === saved.id ? saved : item)) ?? list);
      setDirty(false);
      setSaveState('idle');
      return true;
    } catch {
      setSaveState('error');
      return false;
    }
  };

  const open = (character: Character) => {
    setSaveState('idle');
    setDirty(false);
    setDraft(toDraft(character));
    setTab('identity');
    setCreatingId(null);
  };

  const pick = (id: string) => {
    const character = characters?.find((item) => item.id === id);
    if (character) open(character);
  };

  const create = async () => {
    const created = await createCharacter();
    setCharacters((list) => [created, ...(list ?? [])]);
    setQuery('');
    setRosterPage(0);
    open(created);
    setCreatingId(created.id);
  };

  // 編輯分頁的右上角按鈕：新增中的角色顯示「確定新增」、原有的角色顯示「確定修改」，
  // 按下後存檔並回到角色總覽。總覽時顯示「新增調查員」。
  const isEditing = tab !== 'roster' && draft !== null;
  const isCreating = isEditing && draft.id === creatingId;
  const confirmEdit = async () => {
    if (!(await persist())) return;
    setCreatingId(null);
    setTab('roster');
  };

  // 沒按確定就要離開編輯分頁時，先跳「確定離開？」。
  // 返回鍵、調查員分頁走 backToRoster；導覽列連結、瀏覽器上一頁由 useBlocker 擋下。
  const needsConfirm = isEditing && (isCreating || dirty);
  const blocker = useBlocker(needsConfirm);
  const creatingIdRef = useRef<string | null>(null);
  creatingIdRef.current = creatingId;

  /** 放棄這次編輯：新增中的角色取消新增（刪掉），原有角色不保存修改。 */
  const discardEdits = () => {
    const id = creatingIdRef.current;
    if (id) {
      creatingIdRef.current = null;
      setCharacters((list) => list?.filter((item) => item.id !== id) ?? list);
      void deleteCharacter(id).catch(() => undefined);
    }
    setCreatingId(null);
    setDraft(null);
    setDirty(false);
    setSaveState('idle');
  };

  /** 回到角色總覽（返回鍵、調查員分頁）。 */
  const backToRoster = () => {
    if (needsConfirm) setLeaving('roster');
    else setTab('roster');
  };

  const confirmLeave = () => {
    discardEdits();
    if (blocker.state === 'blocked') blocker.proceed();
    else setTab('roster');
    setLeaving(null);
  };

  const cancelLeave = () => {
    if (blocker.state === 'blocked') blocker.reset();
    setLeaving(null);
  };

  // 保險：離開頁面時，還沒按「確定新增」的角色也取消新增。
  useEffect(
    () => () => {
      const id = creatingIdRef.current;
      if (id) void deleteCharacter(id).catch(() => undefined);
    },
    [],
  );

  const remove = async () => {
    if (!draft) return;
    setDeleteError('');
    try {
      await deleteCharacter(draft.id);
      setCharacters((list) => list?.filter((item) => item.id !== draft.id) ?? list);
      creatingIdRef.current = null;
      setCreatingId(null);
      setDirty(false);
      setDraft(null);
      setTab('roster');
      setConfirmingDelete(false);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : '刪除失敗');
    }
  };

  const derived = useMemo(
    () => (draft ? deriveSheet(draft.data, draft.occupation) : null),
    [draft],
  );
  const filtered = useMemo(
    () => (characters ?? []).filter((character) => matchesSearch(character, query)),
    [characters, query],
  );
  const safeRosterPage = Math.min(rosterPage, pageCount(filtered.length) - 1);

  const renderTab = () => {
    if (tab === 'roster' || !draft || !derived) {
      if (loadError) return <p className="sheet__page sheet__note">{loadError}</p>;
      if (!characters) return <p className="sheet__page sheet__note">讀取中…</p>;
      return (
        <RosterTab
          characters={filtered}
          selectedId={draft?.id ?? null}
          page={safeRosterPage}
          onPageChange={setRosterPage}
          onPick={pick}
          onCreate={() => void create()}
        />
      );
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

  const subtitle =
    tab === 'roster' || !draft
      ? '— 請選擇調查員'
      : `— ${draft.name || '未命名調查員'}${draft.occupation ? `（${draft.occupation}）` : ''}`;

  return (
    <div className="characters-layout">
      <TopNav current="characters" />
      <main className="characters">
        <header className="characters__top">
          <h1 className="characters__title">
            調查員檔案夾 <small>{subtitle}</small>
          </h1>
          <div className="characters__actions">
            {tab === 'roster' ? (
              <input
                type="search"
                className="characters__search"
                placeholder="搜尋角色名稱、職業或標籤"
                aria-label="搜尋調查員"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setRosterPage(0);
                }}
              />
            ) : (
              <span className="characters__save-state" role="status">
                {saveState !== 'idle' ? SAVE_MESSAGES[saveState] : dirty ? '尚未儲存' : ''}
              </span>
            )}
            {isEditing ? (
              <button
                type="button"
                className="characters__button characters__button--primary"
                onClick={() => void confirmEdit()}
              >
                {isCreating ? '確定新增' : '確定修改'}
              </button>
            ) : (
              <button type="button" className="characters__button" onClick={() => void create()}>
                新增調查員
              </button>
            )}
            {/* 刪除的是正在編輯的角色，總覽沒有選定角色，所以只在編輯分頁顯示 */}
            {isEditing && (
              <button
                type="button"
                className="characters__button"
                onClick={() => {
                  setDeleteError('');
                  setConfirmingDelete(true);
                }}
              >
                刪除調查員
              </button>
            )}
          </div>
        </header>

        <div className="characters__fit" ref={fitRef}>
          <div
            className="characters__frame"
            style={{ width: STAGE_WIDTH * scale, height: STAGE_HEIGHT * scale }}
          >
            <div className="characters__stage" style={{ transform: `scale(${scale})` }}>
              <div className="notebook" style={{ backgroundImage: `url(${notebookImage})` }}>
                <div className="sheet" role="tabpanel" id={`characters-panel-${tab}`}>
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
                    aria-controls={`characters-panel-${id}`}
                    disabled={id !== 'roster' && !draft}
                    onClick={() => (id === 'roster' ? backToRoster() : setTab(id))}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {(leaving || blocker.state === 'blocked') && (
          <div className="dialog-backdrop" onClick={cancelLeave}>
            <div
              className="dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="leave-title"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id="leave-title">確定離開？</h2>
              <p>
                {isCreating
                  ? '新增的調查員還沒按「確定新增」，離開後不會保存。'
                  : '這次的修改還沒按「確定修改」，離開後不會保存。'}
              </p>
              <div className="dialog__actions">
                <button type="button" className="characters__button" onClick={cancelLeave}>
                  取消
                </button>
                <button
                  type="button"
                  className="characters__button characters__button--primary"
                  onClick={confirmLeave}
                >
                  確定離開
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmingDelete && draft && (
          <div className="dialog-backdrop" onClick={() => setConfirmingDelete(false)}>
            <div
              className="dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id="delete-title">刪除「{draft.name || '未命名調查員'}」？</h2>
              <p>這位調查員的所有資料都會刪除，無法復原。</p>
              {deleteError && (
                <p className="dialog__error" role="alert">
                  ⚠ {deleteError}
                </p>
              )}
              <div className="dialog__actions">
                <button
                  type="button"
                  className="characters__button"
                  onClick={() => setConfirmingDelete(false)}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="characters__button characters__button--primary"
                  onClick={() => void remove()}
                >
                  確定刪除
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
