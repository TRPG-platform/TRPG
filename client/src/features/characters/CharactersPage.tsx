import { deriveSheet, type Character } from '@takoyaki/shared';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
const AUTO_SAVE_DELAY = 2000;

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

type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';
const SAVE_MESSAGES: Record<SaveState, string> = {
  idle: '',
  pending: '編輯中…（停止輸入 2 秒後自動存檔）',
  saving: '存檔中…',
  saved: '已存檔',
  error: '存檔失敗，請再修改一次以重新存檔',
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
  const { ref: fitRef, scale } = useStageScale();

  // 用版本號判斷有沒有未存的修改：每次編輯 +1，存檔成功時記下存到哪一版。
  const draftRef = useRef<Draft | null>(null);
  const editVersion = useRef(0);
  const savedVersion = useRef(0);
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
    editVersion.current += 1;
    setDraft((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      recipe(next);
      return next;
    });
  }, []);

  const persist = useCallback(async () => {
    const current = draftRef.current;
    if (!current || editVersion.current === savedVersion.current) return;
    const version = editVersion.current;
    setSaveState('saving');
    try {
      const saved = await saveCharacter(current.id, toChanges(current));
      savedVersion.current = version;
      setCharacters((list) => list?.map((item) => (item.id === saved.id ? saved : item)) ?? list);
      setSaveState(version === editVersion.current ? 'saved' : 'pending');
    } catch {
      setSaveState('error');
    }
  }, []);

  // 最後一次修改後 2 秒自動存檔。
  useEffect(() => {
    if (!draft || editVersion.current === savedVersion.current) return;
    setSaveState('pending');
    const timer = window.setTimeout(() => void persist(), AUTO_SAVE_DELAY);
    return () => window.clearTimeout(timer);
  }, [draft, persist]);

  // 離開頁面（導覽列、返回鍵）時，還沒等到自動存檔的修改要先存掉，否則會遺失。
  useEffect(() => () => void persist(), [persist]);

  // 在編輯分頁時，導覽列返回鍵回到總覽（README「導覽列的返回鍵」）。
  const backToRoster = () => {
    void persist();
    setTab('roster');
  };

  const open = (character: Character) => {
    editVersion.current = 0;
    savedVersion.current = 0;
    setSaveState('idle');
    setDraft(toDraft(character));
    setTab('identity');
  };

  const pick = async (id: string) => {
    await persist();
    const character = characters?.find((item) => item.id === id);
    if (character) open(character);
  };

  const create = async () => {
    await persist();
    const created = await createCharacter();
    setCharacters((list) => [created, ...(list ?? [])]);
    setQuery('');
    setRosterPage(0);
    open(created);
  };

  const remove = async () => {
    if (!draft) return;
    setDeleteError('');
    try {
      await deleteCharacter(draft.id);
      setCharacters((list) => list?.filter((item) => item.id !== draft.id) ?? list);
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
          onPick={(id) => void pick(id)}
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
      <TopNav current="characters" onBack={tab !== 'roster' && draft ? backToRoster : undefined} />
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
                {SAVE_MESSAGES[saveState]}
              </span>
            )}
            <button type="button" className="characters__button" onClick={() => void create()}>
              新增調查員
            </button>
            <button
              type="button"
              className="characters__button"
              disabled={tab === 'roster' || !draft}
              onClick={() => {
                setDeleteError('');
                setConfirmingDelete(true);
              }}
            >
              刪除調查員
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
