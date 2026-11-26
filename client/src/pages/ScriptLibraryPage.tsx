import { useState } from 'react';
import type { Script } from '@takoyaki/shared';
import TopNav from '../components/TopNav';
import { scriptSamples } from './scriptSamples';

const labels: Record<Script['status'], string> = {
  'in-progress': '進行中',
  draft: '草稿',
  completed: '已完成',
};
const statuses = Object.keys(labels) as Script['status'][];
const rules = [...new Set(scriptSamples.map((script) => script.rule))];
const tags = [...new Set(scriptSamples.flatMap((script) => script.tags))];
const pageSize = 4;

export function ScriptLibraryPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Script['status'] | ''>('');
  const [rule, setRule] = useState('');
  const [tag, setTag] = useState('');
  const [list, setList] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(scriptSamples[0].cover);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = scriptSamples.filter((script) => {
    const searchable = [script.title, script.rule, ...script.tags].join(' ').toLowerCase();
    return (
      searchable.includes(query.trim().toLowerCase()) &&
      (!status || script.status === status) &&
      (!rule || script.rule === rule) &&
      (!tag || script.tags.includes(tag))
    );
  });
  const lastPage = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div className="figma-layout">
      <TopNav current="scripts" />
      <main className="script-layout">
        <div className="script-top">
          <div>
            <h1>▤ 劇本庫管理</h1>
            <p>管理你的劇本、建立新劇本，或從範本快速開始。</p>
          </div>
          <div className="script-tools">
            <input
              type="search"
              aria-label="搜尋劇本"
              placeholder="搜尋劇本名稱、標籤或規則"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
            <button
              type="button"
              aria-label="卡片檢視"
              aria-pressed={!list}
              onClick={() => setList(false)}
            >
              ⊞
            </button>
            <button
              type="button"
              aria-label="清單檢視"
              aria-pressed={list}
              onClick={() => setList(true)}
            >
              ☷
            </button>
          </div>
        </div>

        <div className="script-filters">
          <button
            type="button"
            aria-pressed={!status}
            onClick={() => {
              setStatus('');
              setPage(1);
            }}
          >
            全部 ({scriptSamples.length})
          </button>
          {statuses.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => {
                setStatus(value);
                setPage(1);
              }}
            >
              {labels[value]} ({scriptSamples.filter((script) => script.status === value).length})
            </button>
          ))}
          <select
            aria-label="規則系統"
            value={rule}
            onChange={(event) => {
              setRule(event.target.value);
              setPage(1);
            }}
          >
            <option value="">規則系統</option>
            {rules.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select
            aria-label="標籤"
            value={tag}
            onChange={(event) => {
              setTag(event.target.value);
              setPage(1);
            }}
          >
            <option value="">標籤</option>
            {tags.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>

        <div className="script-create">
          {showCreate && <span role="status">劇本編輯器尚未接上。</span>}
          <button type="button" onClick={() => setShowCreate(!showCreate)}>
            ＋ 建立新劇本
          </button>
        </div>

        {filtered.length === 0 && <p role="status">找不到符合條件的劇本。</p>}
        <div className={list ? 'script-grid script-list' : 'script-grid'}>
          {filtered.slice((page - 1) * pageSize, page * pageSize).map((script) => (
            <article
              className="script-card"
              data-selected={selected === script.cover}
              key={script.cover}
            >
              <div className="script-cover">
                <img src={`/script-covers/${script.cover}.webp`} alt="" />
                <span className={`script-badge ${script.status}`}>{labels[script.status]}</span>
              </div>
              <div className="script-card-body">
                <div className="script-card-heading">
                  <h2>
                    <button type="button" onClick={() => setSelected(script.cover)}>
                      {script.title}
                    </button>
                  </h2>
                  <button
                    type="button"
                    aria-label={`收藏「${script.title}」`}
                    aria-pressed={favorites.includes(script.cover)}
                    onClick={() =>
                      setFavorites((current) =>
                        current.includes(script.cover)
                          ? current.filter((value) => value !== script.cover)
                          : [...current, script.cover],
                      )
                    }
                  >
                    {favorites.includes(script.cover) ? '★' : '☆'}
                  </button>
                </div>
                <p>
                  {script.rule} ｜ {script.players} 人 ｜ {script.scenes} 場景
                </p>
                <ul>
                  {script.tags.map((value) => (
                    <li key={value}>{value}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {lastPage > 1 && (
          <nav className="script-pagination" aria-label="劇本分頁">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              aria-label="上一頁"
            >
              ←
            </button>
            {Array.from({ length: lastPage }, (_, index) => index + 1).map((value) => (
              <button
                key={value}
                type="button"
                aria-current={value === page ? 'page' : undefined}
                onClick={() => setPage(value)}
              >
                {value}
              </button>
            ))}
            <button
              type="button"
              disabled={page === lastPage}
              onClick={() => setPage(page + 1)}
              aria-label="下一頁"
            >
              →
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}
