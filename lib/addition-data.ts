export interface AdditionProblem {
  id: string;
  num1: number;
  num2: number;
  answer: number;
  choices: number[]; // 選択肢（正解を含む）
  color: string;
}

// 1つの問題を生成する関数
const generateSingleProblem = (): AdditionProblem => {
  const colors = [
    "#FF6B6B", // 赤
    "#4ECDC4", // ターコイズ
    "#45B7D1", // 青
    "#96CEB4", // 緑
    "#FFEAA7", // 黄
    "#DDA0DD", // 紫
    "#98D8C8", // ミント
    "#F7DC6F", // イエロー
    "#BB8FCE", // ラベンダー
    "#85C1E9", // ライトブルー
  ];

  // 1~10のランダムな数字を生成
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const answer = num1 + num2;
  
  // 選択肢を生成（正解 + 3つの間違った選択肢）
  const choices = new Set<number>();
  choices.add(answer);
  
  // 間違った選択肢を追加（答えに近い値やランダムな値）
  while (choices.size < 4) {
    // 答え±5の範囲でランダムに生成
    const offset = Math.floor(Math.random() * 11) - 5; // -5から+5の範囲
    const wrongAnswer = answer + offset;
    if (wrongAnswer > 0 && wrongAnswer !== answer && wrongAnswer <= 20) {
      choices.add(wrongAnswer);
    } else {
      // もし範囲外なら、1~20の範囲でランダムに生成
      const randomAnswer = Math.floor(Math.random() * 20) + 1;
      if (randomAnswer !== answer) {
        choices.add(randomAnswer);
      }
    }
  }
  
  // Setを配列に変換してシャッフル
  const choicesArray = Array.from(choices);
  for (let i = choicesArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choicesArray[i], choicesArray[j]] = [choicesArray[j], choicesArray[i]];
  }

  return {
    id: `add-${num1}-${num2}-${Date.now()}`,
    num1,
    num2,
    answer,
    choices: choicesArray,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
};

// 新しいランダムな問題を生成する関数（シーンコンポーネントから使用）
export const generateRandomProblem = (): AdditionProblem => {
  return generateSingleProblem();
};
