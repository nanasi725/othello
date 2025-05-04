'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState<1 | 2>(1);
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const deltas: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  const clickHandler = (x: number, y: number) => {
    if (board[y][x] !== 0) return;
    const me = turnColor,
      opp = 3 - turnColor;
    const newBoard = structuredClone(board);
    let flippedAny = false;

    deltas.forEach(([dx, dy]) => {
      let nx = x + dx,
        ny = y + dy;
      const path: [number, number][] = [];
      while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && newBoard[ny][nx] === opp) {
        path.push([nx, ny]);
        nx += dx;
        ny += dy;
      }
      if (path.length > 0 && nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && newBoard[ny][nx] === me) {
        path.forEach(([fx, fy]) => {
          newBoard[fy][fx] = me;
        });
        flippedAny = true;
      }
    });

    if (flippedAny) {
      newBoard[y][x] = me;
      setBoard(newBoard);
      setTurnColor(opp as 1 | 2);
    }
  };

  // "置ける場所がない" ときは自動でパス（手番交代）する
  useEffect(() => {
    const me = turnColor;
    const opp = (3 - me) as 1 | 2;
    let hasMove = false;

    // 盤面上のすべての空マスを調べて、
    // どこかに有効手があれば hasMove = true
    outer: for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board[y][x] !== 0) continue;
        for (const [dx, dy] of deltas) {
          let nx = x + dx,
            ny = y + dy;
          let foundOpp = false;
          while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] === opp) {
            foundOpp = true;
            nx += dx;
            ny += dy;
          }
          if (foundOpp && nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] === me) {
            hasMove = true;
            break outer;
          }
        }
      }
    }

    if (!hasMove) {
      console.log(`${me === 1 ? 'Black' : 'White'} has no moves → pass`);
      setTurnColor(opp);
    }
  }, [board, turnColor, deltas]);

  // 黒・白の石の数をカウント
  const flat = board.flat();
  const blackCount = flat.filter((c) => c === 1).length;
  const whiteCount = flat.filter((c) => c === 2).length;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 盤面 */}
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((color, x) => (
              <div key={`${x}-${y}`} className={styles.cell} onClick={() => clickHandler(x, y)}>
                {color !== 0 && (
                  <div
                    className={styles.stone}
                    style={{ background: color === 1 ? '#000' : '#fff' }}
                  />
                )}
              </div>
            )),
          )}
        </div>

        {/* カウント表示 */}
        <div className={styles.counts}>
          <div className={`${styles.countBox} ${styles.countBoxBlack}`}>Black {blackCount}</div>
          <div className={`${styles.countBox} ${styles.countBoxWhite}`}>White {whiteCount}</div>
        </div>
      </div>
    </div>
  );
}
