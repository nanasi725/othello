'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  // ８方向のベクトル [dx, dy]
  const deltas: [number, number][] = [
    [0, 1], // ↑
    [0, -1], // ↓
    [1, 0], // →
    [-1, 0], // ←
    [1, 1], // ↗
    [1, -1], // ↘
    [-1, 1], // ↖
    [-1, -1], // ↙
  ];

  const clickHandler = (x: number, y: number) => {
    // すでに石があるマスは何もしない
    if (board[y][x] !== 0) return;

    const me = turnColor;
    const opp = 3 - me; // 自分が1なら相手は2、2なら1
    // board を壊さないようコピー
    const newBoard = structuredClone(board);

    // 隣接８方向のどこかに相手駒がいたら「置ける」と判断
    const canPlace = deltas.some(([dx, dy]) => {
      return newBoard[y + dy]?.[x + dx] === opp;
    });

    if (!canPlace) {
      // １つも隣接相手駒がなければ何もしない
      return;
    }

    // 置く
    newBoard[y][x] = me;
    setBoard(newBoard);
    // 手番交代
    setTurnColor(opp as 1 | 2);
  };
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? `#000` : `#fff` }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
