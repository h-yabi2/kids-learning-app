export interface AdditionProblem {
  id: string;
  num1: number;
  num2: number;
  answer: number;
  choices: number[]; // 選択肢（正解を含む）
  color: string;
}

// 足し算の問題を生成する関数
const generateAdditionProblems = (): AdditionProblem[] => {
  const problems: AdditionProblem[] = [];
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

  let colorIndex = 0;

  // 1+1から5+5までの簡単な問題を生成
  for (let num1 = 1; num1 <= 5; num1++) {
    for (let num2 = 1; num2 <= 5; num2++) {
      const answer = num1 + num2;
      
      // 選択肢を生成（正解 + 3つの間違った選択肢）
      const choices = new Set<number>();
      choices.add(answer);
      
      // 間違った選択肢を追加（答えに近い値やランダムな値）
      while (choices.size < 4) {
        const wrongAnswer = answer + Math.floor(Math.random() * 5) - 2;
        if (wrongAnswer > 0 && wrongAnswer !== answer) {
          choices.add(wrongAnswer);
        } else {
          // もし範囲外なら、答え±3の範囲でランダムに生成
          const randomOffset = Math.floor(Math.random() * 6) - 3;
          const candidate = answer + randomOffset;
          if (candidate > 0 && candidate !== answer) {
            choices.add(candidate);
          }
        }
      }
      
      // Setを配列に変換してシャッフル
      const choicesArray = Array.from(choices);
      for (let i = choicesArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choicesArray[i], choicesArray[j]] = [choicesArray[j], choicesArray[i]];
      }

      problems.push({
        id: `add-${num1}-${num2}`,
        num1,
        num2,
        answer,
        choices: choicesArray,
        color: colors[colorIndex % colors.length],
      });
      
      colorIndex++;
    }
  }

  return problems;
};

export const additionProblems: AdditionProblem[] = generateAdditionProblems();

