export interface NumberItem {
  id: string;
  number: number;
  nameJapanese: string;
  nameEnglish: string;
  color: string;
  strokeOrder: string[]; // 書き順のパスデータ
}

export const numbersData: NumberItem[] = [
  {
    id: "1",
    number: 1,
    nameJapanese: "いち",
    nameEnglish: "one",
    color: "#FF6B6B",
    strokeOrder: [
      "M 140 50 L 140 200", // 縦線
    ],
  },
  {
    id: "2",
    number: 2,
    nameJapanese: "に",
    nameEnglish: "two",
    color: "#4ECDC4",
    strokeOrder: [
      "M 100 60 Q 120 40 140 60 Q 160 80 180 60", // 上の曲線
      "M 100 100 L 180 100", // 横線
      "M 100 100 L 100 200", // 左の縦線
      "M 180 100 L 180 200", // 右の縦線
    ],
  },
  {
    id: "3",
    number: 3,
    nameJapanese: "さん",
    nameEnglish: "three",
    color: "#45B7D1",
    strokeOrder: [
      "M 100 60 Q 120 40 140 60 Q 160 80 180 60", // 上の曲線
      "M 100 100 Q 120 80 140 100 Q 160 120 180 100", // 中の曲線
      "M 100 140 Q 120 120 140 140 Q 160 160 180 140", // 下の曲線
      "M 100 140 L 100 200", // 左の縦線
      "M 180 140 L 180 200", // 右の縦線
    ],
  },
  {
    id: "4",
    number: 4,
    nameJapanese: "よん",
    nameEnglish: "four",
    color: "#96CEB4",
    strokeOrder: [
      "M 100 50 L 100 120", // 左の縦線
      "M 100 120 L 180 120", // 横線
      "M 180 50 L 180 200", // 右の縦線
    ],
  },
  {
    id: "5",
    number: 5,
    nameJapanese: "ご",
    nameEnglish: "five",
    color: "#FFEAA7",
    strokeOrder: [
      "M 100 50 L 180 50", // 上の横線
      "M 100 50 L 100 100", // 左の縦線
      "M 100 100 L 180 100", // 中の横線
      "M 180 100 L 180 200", // 右の縦線
      "M 100 200 L 180 200", // 下の横線
    ],
  },
  {
    id: "6",
    number: 6,
    nameJapanese: "ろく",
    nameEnglish: "six",
    color: "#DDA0DD",
    strokeOrder: [
      "M 100 50 L 100 200", // 左の縦線
      "M 100 50 L 180 50", // 上の横線
      "M 100 100 L 180 100", // 中の横線
      "M 100 200 L 180 200", // 下の横線
      "M 180 100 L 180 200", // 右の縦線
    ],
  },
  {
    id: "7",
    number: 7,
    nameJapanese: "なな",
    nameEnglish: "seven",
    color: "#98D8C8",
    strokeOrder: [
      "M 100 50 L 180 50", // 上の横線
      "M 180 50 L 180 200", // 右の縦線
    ],
  },
  {
    id: "8",
    number: 8,
    nameJapanese: "はち",
    nameEnglish: "eight",
    color: "#F7DC6F",
    strokeOrder: [
      "M 100 50 L 180 50", // 上の横線
      "M 100 50 L 100 200", // 左の縦線
      "M 100 100 L 180 100", // 中の横線
      "M 100 200 L 180 200", // 下の横線
      "M 180 50 L 180 200", // 右の縦線
    ],
  },
  {
    id: "9",
    number: 9,
    nameJapanese: "きゅう",
    nameEnglish: "nine",
    color: "#BB8FCE",
    strokeOrder: [
      "M 100 50 L 180 50", // 上の横線
      "M 100 50 L 100 100", // 左の縦線
      "M 100 100 L 180 100", // 中の横線
      "M 100 200 L 180 200", // 下の横線
      "M 180 50 L 180 200", // 右の縦線
    ],
  },
  {
    id: "10",
    number: 10,
    nameJapanese: "じゅう",
    nameEnglish: "ten",
    color: "#85C1E9",
    strokeOrder: [
      "M 100 50 L 100 200", // 左の縦線
      "M 100 50 L 180 50", // 上の横線
      "M 100 200 L 180 200", // 下の横線
      "M 180 50 L 180 200", // 右の縦線
    ],
  },
];
