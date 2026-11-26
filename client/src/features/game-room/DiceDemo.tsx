import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './DiceDemo.css';

interface DiceRoll {
  id: string;
  value: number;
}

export default function DiceDemo({ sampleRolls }: { sampleRolls: string[] }) {
  const [rolls, setRolls] = useState<DiceRoll[]>([]);
  const [animation, setAnimation] = useState<DiceRoll | null>(null);

  const history = useRef<HTMLUListElement>(null);

  function rollDice() {
    const roll = { id: crypto.randomUUID(), value: 1 + Math.floor(Math.random() * 100) };
    setRolls((previous) => [roll, ...previous]);
    setAnimation(roll);
    if (history.current) history.current.scrollTop = 0;
  }

  return (
    <>
      <button className="game-room__roll-button" type="button" onClick={rollDice}>
        擲 D100
      </button>
      <h3>擲骰紀錄</h3>
      <ul
        className="game-room__roll-history"
        ref={history}
        tabIndex={0}
        aria-label="擲骰紀錄"
        aria-live="polite"
        aria-relevant="additions"
      >
        {rolls.map(({ id, value }) => (
          <li key={id}>1D100 → {value}</li>
        ))}
        {sampleRolls.map((roll) => (
          <li key={roll}>{roll}</li>
        ))}
      </ul>
      {animation &&
        createPortal(
          <div
            key={animation.id}
            className="dice-demo"
            aria-hidden="true"
            onAnimationEnd={(event) => {
              if (event.currentTarget === event.target) setAnimation(null);
            }}
          >
            <div className="dice-demo__shape">
              <span className="dice-demo__face">{animation.value}</span>
            </div>
            <span className="dice-demo__label">D100</span>
          </div>,
          document.body,
        )}
    </>
  );
}
