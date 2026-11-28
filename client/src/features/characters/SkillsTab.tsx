import { SKILL_GROUPS, SKILL_PAGES, type DerivedSheet } from '@takoyaki/shared';
import { useState } from 'react';
import { findSkill, patchSkill, type Draft, type UpdateDraft } from './draft';
import { NumberInput, PageHeading } from './fields';

// 技能一／技能二分頁。左頁上方是點數、搜尋與「只看有加點」，篩選同時套用到左右兩頁。

interface SkillsTabProps {
  page: 'skills1' | 'skills2';
  draft: Draft;
  derived: DerivedSheet;
  update: UpdateDraft;
}

const HEADINGS = {
  skills1: { eyebrow: 'SKILLS · I', title: '技能列表（一）' },
  skills2: { eyebrow: 'SKILLS · II', title: '技能列表（二）' },
};

export default function SkillsTab({ page, draft, derived, update }: SkillsTabProps) {
  const [query, setQuery] = useState('');
  const [onlyTrained, setOnlyTrained] = useState(false);
  const { occupationPoints, interestPoints } = derived;
  const heading = HEADINGS[page];

  const renderColumn = (groupIds: string[]) =>
    SKILL_GROUPS.filter((group) => groupIds.includes(group.id)).map((group) => {
      const rows = group.skills.filter((skill) => {
        const input = findSkill(draft.data, skill.id);
        const label = `${skill.name}${input.customName ?? ''}`;
        return (
          (!query.trim() || label.includes(query.trim())) &&
          (!onlyTrained || derived.skills[skill.id].trained)
        );
      });
      if (rows.length === 0) return null;

      return (
        <section key={group.id} className="sheet__group">
          <h3 className="sheet__group-title">{group.name}</h3>
          {rows.map((skill) => {
            const input = findSkill(draft.data, skill.id);
            const value = derived.skills[skill.id];
            const set = (patch: Parameters<typeof patchSkill>[2]) =>
              update((d) => patchSkill(d, skill.id, patch));
            return (
              <div key={skill.id} className={`skill-row${value.trained ? '' : ' skill-row--dim'}`}>
                <input
                  type="checkbox"
                  checked={input.usedThisSession}
                  aria-label={`${skill.name}本次成功使用過`}
                  onChange={(event) => set({ usedThisSession: event.target.checked })}
                />
                <span className="skill-row__name">
                  {skill.name}
                  {skill.custom && (
                    <input
                      value={input.customName ?? ''}
                      placeholder={skill.id === 'native-language' ? '語言' : '項目'}
                      aria-label={`${skill.name}項目`}
                      onChange={(event) => set({ customName: event.target.value })}
                    />
                  )}
                </span>
                <span className="skill-row__base">{value.base}</span>
                <NumberInput
                  aria-label={`${skill.name}職業點數`}
                  value={input.occupation || null}
                  nullable
                  onChange={(next) => set({ occupation: next ?? 0 })}
                />
                <NumberInput
                  aria-label={`${skill.name}興趣點數`}
                  value={input.interest || null}
                  nullable
                  onChange={(next) => set({ interest: next ?? 0 })}
                />
                <NumberInput
                  aria-label={`${skill.name}成長點數`}
                  value={input.growth || null}
                  nullable
                  onChange={(next) => set({ growth: next ?? 0 })}
                />
                <span className="skill-row__final">{value.final}</span>
                <span className="skill-row__levels">
                  {value.half}
                  <br />
                  {value.fifth}
                </span>
              </div>
            );
          })}
        </section>
      );
    });

  const header = (
    <div className="skill-row skill-row--head">
      <span>長</span>
      <span>技能名稱</span>
      <span>初始</span>
      <span>職業</span>
      <span>興趣</span>
      <span>成長</span>
      <span>最終</span>
      <span>½／⅕</span>
    </div>
  );

  const [leftGroups, rightGroups] = SKILL_PAGES[page];

  return (
    <>
      <div className="sheet__page sheet__page--scroll">
        <PageHeading {...heading} />
        <div className="points">
          <div className={`points__box${occupationPoints.over ? ' points__box--over' : ''}`}>
            <small>職業點數</small>
            <b>
              {occupationPoints.used} / {occupationPoints.available}
            </b>
          </div>
          <div className={`points__box${interestPoints.over ? ' points__box--over' : ''}`}>
            <small>興趣點數</small>
            <b>
              {interestPoints.used} / {interestPoints.available}
            </b>
          </div>
        </div>
        {(occupationPoints.over || interestPoints.over) && (
          <p className="sheet__alert" role="alert">
            ⚠ {occupationPoints.over ? '職業點數超出上限' : '興趣點數超出上限'}
          </p>
        )}
        <div className="skill-tools">
          <input
            type="search"
            placeholder="搜尋技能"
            aria-label="搜尋技能"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={onlyTrained}
              onChange={(event) => setOnlyTrained(event.target.checked)}
            />{' '}
            只看有加點
          </label>
        </div>
        {header}
        {renderColumn(leftGroups)}
      </div>

      <div className="sheet__page sheet__page--scroll">
        <PageHeading {...heading} />
        <p className="sheet__note">
          □ 打勾＝本次冒險成功使用過，幕間可進行成長檢定。＊ 標記技能需經 KP 同意。
        </p>
        {header}
        {renderColumn(rightGroups)}
      </div>
    </>
  );
}
