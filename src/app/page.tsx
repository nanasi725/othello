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
    [1, 0], //  右
    [-1, 0], //  左
    [0, 1], //  上
    [0, -1], //  下
    [1, 1], //  右上
    [1, -1], //  右下
    [-1, 1], // 左上
    [-1, -1], // 左下
  ];

  const clickHandler = (x: number, y: number) => {
    if (board[y][x] !== 0) return;
    const me = turnColor;
    const opp = 3 - turnColor;
    // board の不変性を保つため深いコピー
    const newBoard = structuredClone(board);
    let flippedAny = false;

    // ８方向すべてをチェック
    deltas.forEach(([dx, dy]) => {
      let nx = x + dx;
      let ny = y + dy;
      const path: [number, number][] = [];

      // 相手駒が連続する限り path に蓄積
      while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && newBoard[ny][nx] === opp) {
        path.push([nx, ny]);
        nx += dx;
        ny += dy;
      }

      // path に１つ以上あって、その先が自分駒なら挟めている
      if (path.length > 0 && nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && newBoard[ny][nx] === me) {
        // path 中のすべての駒をひっくり返す
        path.forEach(([fx, fy]) => {
          newBoard[fy][fx] = me;
        });
        flippedAny = true;
      }
    });

    // １つでも返せたらクリック地点に駒を置いて state 更新
    if (flippedAny) {
      newBoard[y][x] = me;
      setBoard(newBoard);
      setTurnColor(opp as 1 | 2);
    }
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
