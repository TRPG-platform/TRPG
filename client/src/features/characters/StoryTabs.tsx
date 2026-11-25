import { WEAPON_SKILLS, type DerivedSheet } from '@takoyaki/shared';
import type { Draft, UpdateDraft } from './draft';
import { PageHeading, TextArea } from './fields';

// 第二階段的三個分頁：裝備、背景、紀錄。

interface TabProps {
  draft: Draft;
  update: UpdateDraft;
}

export function EquipmentTab({ draft, derived, update }: TabProps & { derived: DerivedSheet }) {
  const weapons = draft.data.weapons;

  return (
    <>
      <div className="sheet__page sheet__page--scroll">
        <PageHeading eyebrow="ARMAMENT" title="攻擊方式（武器）" />
        <p className="sheet__note">選擇使用技能後，正常／困難／極限值會依技能最終值自動帶入。</p>
        <div className="weapons">
          {weapons.length === 0 && <p className="sheet__note">尚未登記武器。</p>}
          {weapons.map((weapon, index) => {
            const skill = weapon.skillId ? derived.skills[weapon.skillId] : undefined;
            const set = (key: keyof typeof weapon, value: string) =>
              update((d) => {
                d.data.weapons[index][key] = value;
              });
            return (
              <div key={index} className="weapon">
                <label className="cell cell--wide">
                  武器
                  <input
                    value={weapon.name}
                    onChange={(event) => set('name', event.target.value)}
                  />
                </label>
                <label className="cell">
                  使用技能
                  <select
                    value={weapon.skillId}
                    onChange={(event) => set('skillId', event.target.value)}
                  >
                    <option value="">—</option>
                    {WEAPON_SKILLS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="cell">
                  正常／困難／極限
                  <div className="weapon__levels">
                    {skill ? (
                      <>
                        {skill.final}
                        <em>/</em>
                        {skill.half}
                        <em>/</em>
                        {skill.fifth}
                      </>
                    ) : (
                      <em>選擇技能</em>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="remove-button"
                  aria-label="刪除這把武器"
                  onClick={() =>
                    update((d) => {
                      d.data.weapons.splice(index, 1);
                    })
                  }
                >
                  ✕
                </button>
                <label className="cell">
                  傷害
                  <input
                    value={weapon.damage}
                    onChange={(event) => set('damage', event.target.value)}
                  />
                </label>
                <label className="cell">
                  範圍
                  <input
                    value={weapon.range}
                    onChange={(event) => set('range', event.target.value)}
                  />
                </label>
                <label className="cell">
                  次數
                  <input
                    value={weapon.uses}
                    onChange={(event) => set('uses', event.target.value)}
                  />
                </label>
                <label className="cell">
                  彈藥
                  <input
                    value={weapon.ammo}
                    onChange={(event) => set('ammo', event.target.value)}
                  />
                </label>
                <label className="cell">
                  故障
                  <input
                    value={weapon.malfunction}
                    onChange={(event) => set('malfunction', event.target.value)}
                  />
                </label>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="add-button"
          onClick={() =>
            update((d) => {
              d.data.weapons.push({
                name: '',
                skillId: '',
                damage: '',
                range: '',
                uses: '1',
                ammo: '',
                malfunction: '',
              });
            })
          }
        >
          ＋ 新增武器
        </button>
      </div>

      <div className="sheet__page">
        <PageHeading eyebrow="BELONGINGS" title="攜帶物品" />
        <div className="stack">
          <TextArea
            label="攜帶物品"
            rows={8}
            value={draft.data.belongings}
            onChange={(value) =>
              update((d) => {
                d.data.belongings = value;
              })
            }
          />
          <TextArea
            label="特殊／魔法物品"
            rows={4}
            value={draft.data.specialItems}
            onChange={(value) =>
              update((d) => {
                d.data.specialItems = value;
              })
            }
          />
        </div>
      </div>
    </>
  );
}

export function BackgroundTab({ draft, update }: TabProps) {
  const backstory = draft.data.backstory;
  const field = (key: keyof typeof backstory, label: string, rows = 3) => (
    <TextArea
      label={label}
      rows={rows}
      value={backstory[key]}
      onChange={(value) =>
        update((d) => {
          d.data.backstory[key] = value;
        })
      }
    />
  );

  return (
    <>
      <div className="sheet__page sheet__page--scroll">
        <PageHeading eyebrow="BACKSTORY" title="角色背景列表" />
        <div className="stack">
          {field('beliefs', '思想與信念')}
          {field('significantPeople', '重要之人')}
          <div className="grid-2">
            {field('meaningfulLocations', '意義非凡之地')}
            {field('treasuredPossessions', '寶貴之物')}
          </div>
          <div className="grid-2">
            {field('traits', '特點')}
            {field('bonds', '羈絆')}
          </div>
        </div>
      </div>
      <div className="sheet__page sheet__page--scroll">
        <PageHeading eyebrow="STORY" title="背景故事" />
        <div className="stack">
          {field('story', '背景故事', 9)}
          {field('intro', '故事小劇場／導入', 6)}
        </div>
      </div>
    </>
  );
}

export function RecordTab({ draft, update }: TabProps) {
  const record = draft.data.record;
  const field = (key: Exclude<keyof typeof record, 'relations'>, label: string, rows = 3) => (
    <TextArea
      label={label}
      rows={rows}
      value={record[key]}
      onChange={(value) =>
        update((d) => {
          d.data.record[key] = value;
        })
      }
    />
  );

  return (
    <>
      <div className="sheet__page sheet__page--scroll">
        <PageHeading eyebrow="RELATIONS" title="玩家間人際關係" />
        <div className="stack">
          {record.relations.length === 0 && <p className="sheet__note">尚未登記人際關係。</p>}
          {record.relations.map((relation, index) => {
            const set = (key: keyof typeof relation, value: string) =>
              update((d) => {
                d.data.record.relations[index][key] = value;
              });
            return (
              <div key={index} className="relation">
                <label className="cell">
                  角色
                  <input
                    value={relation.character}
                    onChange={(event) => set('character', event.target.value)}
                  />
                </label>
                <label className="cell">
                  所屬玩家
                  <input
                    value={relation.player}
                    onChange={(event) => set('player', event.target.value)}
                  />
                </label>
                <label className="cell">
                  關係
                  <input
                    value={relation.relation}
                    onChange={(event) => set('relation', event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="remove-button"
                  aria-label="刪除這筆關係"
                  onClick={() =>
                    update((d) => {
                      d.data.record.relations.splice(index, 1);
                    })
                  }
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="add-button"
          onClick={() =>
            update((d) => {
              d.data.record.relations.push({ character: '', player: '', relation: '' });
            })
          }
        >
          ＋ 新增關係
        </button>
        <h3 className="sheet__group-title">探索者經歷</h3>
        <div className="stack">
          {field('scenariosPlayed', '跑過劇本')}
          {field('specialEvents', '冒險故事特殊事件')}
        </div>
      </div>
      <div className="sheet__page sheet__page--scroll">
        <PageHeading eyebrow="CASE RECORD" title="創傷與禁忌" />
        <div className="stack">
          <div className="grid-2">
            {field('scars', '創傷或傷疤')}
            {field('phobias', '恐懼與狂熱')}
          </div>
          <div className="grid-2">
            {field('encounters', '第三類接觸')}
            {field('tomes', '閱讀的古籍')}
          </div>
          {field('spells', '已知法術及其使用方法', 5)}
        </div>
      </div>
    </>
  );
}
