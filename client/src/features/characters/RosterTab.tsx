import type { Character } from '@takoyaki/shared';
import type { CSSProperties } from 'react';
import { PageHeading, Silhouette } from './fields';
import { SLOTS_PER_PAGE, pageCount } from './roster';

// 調查員分頁（總覽）：照桌面「調查員檔案」原型的拍立得照片牆。
// 左頁 4 欄拍立得（上下置中）、最後一格是「新增」；右頁只有標題。

const ADD_SLOT = 'add' as const;
type Slot = Character | typeof ADD_SLOT;

/** 每張拍立得的傾斜角度，依位置輪流套用。 */
const TILTS = [-2.2, 1.8, -1, 2.4, -1.6];

interface RosterTabProps {
  characters: Character[];
  selectedId: string | null;
  page: number;
  onPageChange: (page: number) => void;
  onPick: (id: string) => void;
  onCreate: () => void;
}

export default function RosterTab({
  characters,
  selectedId,
  page,
  onPageChange,
  onPick,
  onCreate,
}: RosterTabProps) {
  const slots: Slot[] = [...characters, ADD_SLOT];
  const total = pageCount(characters.length);
  const visible = slots.slice(page * SLOTS_PER_PAGE, (page + 1) * SLOTS_PER_PAGE);

  return (
    <>
      <div className="sheet__page sheet__page--roster">
        <PageHeading eyebrow="INVESTIGATOR" title="調查員" />
        <div className="roster">
          {visible.map((slot, index) =>
            slot === ADD_SLOT ? (
              <button
                key="add"
                type="button"
                className="polaroid polaroid--add"
                aria-label="新增調查員"
                onClick={onCreate}
              >
                <span className="polaroid__photo">＋</span>
                <span className="polaroid__name">新增</span>
              </button>
            ) : (
              <button
                key={slot.id}
                type="button"
                className={`polaroid${slot.id === selectedId ? ' polaroid--selected' : ''}`}
                style={{ '--tilt': `${TILTS[index % TILTS.length]}deg` } as CSSProperties}
                aria-label={`開啟調查員 ${slot.name || '未命名調查員'}`}
                onClick={() => onPick(slot.id)}
              >
                <span className="polaroid__photo">
                  {slot.portraitUrl ? <img src={slot.portraitUrl} alt="" /> : <Silhouette />}
                </span>
                <span className="polaroid__name">{slot.name || '未命名'}</span>
              </button>
            ),
          )}
        </div>
        {total > 1 && (
          <nav className="roster__nav" aria-label="翻頁">
            <button
              type="button"
              className="paper-button"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
            >
              ‹ 上一頁
            </button>
            <span>
              {page + 1} / {total}
            </span>
            <button
              type="button"
              className="paper-button"
              disabled={page >= total - 1}
              onClick={() => onPageChange(page + 1)}
            >
              下一頁 ›
            </button>
          </nav>
        )}
      </div>

      <div className="sheet__page">
        <PageHeading eyebrow="BASIC" title="調查員" />
      </div>
    </>
  );
}
