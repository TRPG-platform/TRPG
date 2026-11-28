import { OCCUPATIONS } from '@takoyaki/shared';
import { useRef, useState } from 'react';
import type { Draft, UpdateDraft } from './draft';
import { NumberInput, PageHeading, TextArea, TextField } from './fields';

// 身分分頁：立繪、姓名、玩家、檔案編號、建檔日期，以及基本資料。

const MAX_PORTRAIT_SIDE = 480;

/** 把圖片縮到最長邊 480px 再轉成 data URL（假資料階段直接存在角色上）。 */
function readPortrait(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, MAX_PORTRAIT_SIDE / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(image.src);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    image.onerror = () => reject(new Error('無法讀取這張圖片'));
    image.src = URL.createObjectURL(file);
  });
}

/** 標籤輸入：編輯時保留原文字（才打得出結尾的逗號），存成去空白的陣列。 */
function TagsField({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);

  return (
    <label className="field">
      標籤（以逗號分隔，卡片上顯示前 3 個）
      <input
        className="field__input"
        value={editing ? text : tags.join('，')}
        placeholder="例：1920s，霧港，鋼琴"
        onFocus={() => {
          setText(tags.join('，'));
          setEditing(true);
        }}
        onBlur={() => setEditing(false)}
        onChange={(event) => {
          setText(event.target.value);
          onChange(
            event.target.value
              .split(/[,，、]/)
              .map((tag) => tag.trim())
              .filter(Boolean),
          );
        }}
      />
    </label>
  );
}

export default function IdentityTab({ draft, update }: { draft: Draft; update: UpdateDraft }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const identity = draft.data.identity;
  const setIdentity = <K extends keyof typeof identity>(key: K, value: (typeof identity)[K]) =>
    update((d) => {
      d.data.identity[key] = value;
    });

  return (
    <>
      <div className="sheet__page">
        <PageHeading eyebrow="INVESTIGATOR FILE" title="調查員檔案" />
        <button
          type="button"
          className="portrait"
          aria-label="上傳人物肖像"
          onClick={() => fileInput.current?.click()}
        >
          <span className="portrait__photo">
            {draft.portraitUrl ? <img src={draft.portraitUrl} alt="" /> : '點此上傳肖像'}
          </span>
          <span className="portrait__caption">人物肖像</span>
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (!file) return;
            const url = await readPortrait(file);
            update((d) => {
              d.portraitUrl = url;
            });
          }}
        />

        <div className="id-card">
          <div className="id-card__head">
            <span>SUBJECT · 調查對象</span>
            <label>
              FILE No.{' '}
              <input
                className="id-card__number"
                value={identity.fileNumber}
                placeholder="000"
                aria-label="檔案編號"
                onChange={(event) => setIdentity('fileNumber', event.target.value)}
              />
            </label>
          </div>
          <label className="id-card__line id-card__line--big">
            <span>
              姓名<em>(NAME)</em>
            </span>
            <input
              value={draft.name}
              aria-label="調查員姓名"
              onChange={(event) =>
                update((d) => {
                  d.name = event.target.value;
                })
              }
            />
          </label>
          <label className="id-card__line">
            <span>
              玩家<em>(PLAYER)</em>
            </span>
            <input
              value={identity.playerName}
              aria-label="玩家姓名"
              onChange={(event) => setIdentity('playerName', event.target.value)}
            />
          </label>
          <div className="id-card__foot">
            <label>
              建檔日期{' '}
              <input
                value={identity.createdDate}
                placeholder="1925.10.07"
                aria-label="建檔日期"
                onChange={(event) => setIdentity('createdDate', event.target.value)}
              />
            </label>
            <span className="id-card__seal">已建檔</span>
          </div>
        </div>
      </div>

      <div className="sheet__page">
        <PageHeading eyebrow="BASIC DATA" title="基本資料" />
        <div className="stack">
          <div className="grid-2">
            <TextField
              label="職業"
              value={draft.occupation}
              list="characters-occupations"
              placeholder="從清單選或自行輸入"
              onChange={(value) =>
                update((d) => {
                  d.occupation = value;
                })
              }
            />
            <TextField
              label="職業補充"
              value={identity.occupationDetail}
              placeholder="例：鋼琴師"
              onChange={(value) => setIdentity('occupationDetail', value)}
            />
          </div>
          <datalist id="characters-occupations">
            {OCCUPATIONS.map((occupation) => (
              <option key={occupation.name} value={occupation.name} />
            ))}
          </datalist>
          <div className="grid-2">
            <TextField
              label="學歷"
              value={identity.education}
              onChange={(value) => setIdentity('education', value)}
            />
            <TextField
              label="背景年代"
              value={identity.era}
              placeholder="1920s / 現代"
              onChange={(value) => setIdentity('era', value)}
            />
          </div>
          <div className="grid-3">
            <TextField
              label="性別"
              value={identity.gender}
              onChange={(value) => setIdentity('gender', value)}
            />
            <label className="field">
              年齡
              <NumberInput
                className="field__input"
                value={identity.age}
                nullable
                onChange={(value) => setIdentity('age', value)}
              />
            </label>
            <label className="field">
              年齡調整
              <select
                className="field__input"
                value={identity.ageAdjustment}
                onChange={(event) =>
                  setIdentity('ageAdjustment', event.target.value === '有' ? '有' : '無')
                }
              >
                <option>無</option>
                <option>有</option>
              </select>
            </label>
          </div>
          <div className="grid-2">
            <TextField
              label="出生地"
              value={identity.birthplace}
              onChange={(value) => setIdentity('birthplace', value)}
            />
            <TextField
              label="居住地"
              value={identity.residence}
              onChange={(value) => setIdentity('residence', value)}
            />
          </div>
          <TextArea
            label="外表特徵簡述"
            rows={4}
            value={identity.appearance}
            onChange={(value) => setIdentity('appearance', value)}
          />
          <TagsField
            tags={draft.tags}
            onChange={(tags) =>
              update((d) => {
                d.tags = tags;
              })
            }
          />
        </div>
      </div>
    </>
  );
}
