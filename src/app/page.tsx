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
  const _deltas: [number, number][] = [
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
    // 1) すでに石があるマスは何もしない
    if (board[y][x] !== 0) return;

    // 2) 自分と相手の色を数値で決める
    const me = turnColor; // 1 または 2
    const opp = 3 - turnColor; // 2 または 1

    // 3) board を壊さないようコピー
    const newBoard = structuredClone(board);

    // --- ここから「右方向だけ」の裏返しロジック ---
    // 4) 右隣から相手駒が続くだけ path にためる
    let nx = x + 1;
    const path: [number, number][] = [];
    while (nx < 8 && newBoard[y][nx] === opp) {
      path.push([nx, y]);
      nx += 1;
    }

    // 5) path に石が溜まっていて、その先に自分の駒があれば裏返し可
    if (path.length > 0 && nx < 8 && newBoard[y][nx] === me) {
      // (a) クリックしたマスにも自分の駒を置く
      newBoard[y][x] = me;

      // (b) path に溜まった座標をすべて自分の色にひっくり返す
      path.forEach(([fx, fy]) => {
        newBoard[fy][fx] = me;
      });

      // 6) state を更新して手番交代
      setBoard(newBoard);
      setTurnColor(opp as 1 | 2);
    }
    // --- ここまで右方向だけ ---
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
