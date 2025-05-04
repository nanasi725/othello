'use client';

import { useState } from 'react';
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

  /* ８方向ベクトル */
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

  // 石の数をカウント
  const blackCount = board.flat().filter((c) => c === 1).length;
  const whiteCount = board.flat().filter((c) => c === 2).length;

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
                    style={{
                      background: color === 1 ? '#000' : '#fff',
                    }}
                  />
                )}
              </div>
            )),
          )}
        </div>

        {/* カウント表示 */}
        <div className={styles.count}>
          <div>Black: {blackCount}</div>
          <div>White: {whiteCount}</div>
        </div>
      </div>
    </div>
  );
}
