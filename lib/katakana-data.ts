export interface KatakanaItem {
  id: string;
  character: string;
  word: string;
  reading: string;
  color: string;
  row: string;
  image?: string;
}

// 書き順データの型定義
export interface StrokeData {
  path: string;
  number: number;
  startPoint: [number, number];
}

export interface StrokeOrderData {
  strokes: StrokeData[];
  description: string;
}

// 書き順データ
export const strokeOrderData: { [key: string]: StrokeOrderData } = {
  ア: {
    strokes: [
      { path: "M25,30 L70,30 Q60,55 30,75", number: 1, startPoint: [25, 30] },
      { path: "M50,30 Q55,60 65,75", number: 2, startPoint: [50, 30] },
    ],
    description: "①横線から左下へのはらい、②中央から右下へのはらいの順番で書きます",
  },
  イ: {
    strokes: [
      { path: "M60,15 Q40,40 25,75", number: 1, startPoint: [60, 15] },
      { path: "M55,35 L50,80", number: 2, startPoint: [55, 35] },
    ],
    description: "①左下へのはらい、②縦線の順番で書きます",
  },
  ウ: {
    strokes: [
      { path: "M48,15 L52,22", number: 1, startPoint: [48, 15] },
      { path: "M25,35 L75,35", number: 2, startPoint: [25, 35] },
      { path: "M30,35 Q25,60 35,75 Q60,85 78,68", number: 3, startPoint: [30, 35] },
    ],
    description: "①上のてん、②横線、③左から下へ曲げてはらう順番で書きます",
  },
  エ: {
    strokes: [
      { path: "M25,25 L75,25", number: 1, startPoint: [25, 25] },
      { path: "M50,25 L50,75", number: 2, startPoint: [50, 25] },
      { path: "M20,75 L80,75", number: 3, startPoint: [20, 75] },
    ],
    description: "①上の横線、②縦線、③下の横線の順番で書きます",
  },
  オ: {
    strokes: [
      { path: "M25,30 L75,30", number: 1, startPoint: [25, 30] },
      { path: "M55,15 L55,70 Q50,80 40,75", number: 2, startPoint: [55, 15] },
      { path: "M30,45 Q50,65 25,80", number: 3, startPoint: [30, 45] },
    ],
    description: "①横線、②縦線とハネ、③左下へのはらいの順番で書きます",
  },
  カ: {
    strokes: [
      {
        path: "M25,30 L65,30 L70,40 L65,70 Q55,80 40,75",
        number: 1,
        startPoint: [25, 30],
      },
      { path: "M50,45 Q35,65 25,80", number: 2, startPoint: [50, 45] },
    ],
    description: "①横から下に曲げてハネ、②左下へのはらいの順番で書きます",
  },
  キ: {
    strokes: [
      { path: "M30,25 L65,25", number: 1, startPoint: [30, 25] },
      { path: "M20,45 L75,45", number: 2, startPoint: [20, 45] },
      { path: "M50,15 L45,80", number: 3, startPoint: [50, 15] },
    ],
    description: "①上の短い横線、②下の長い横線、③縦線の順番で書きます",
  },
  ク: {
    strokes: [
      { path: "M30,25 L70,30 L65,45", number: 1, startPoint: [30, 25] },
      { path: "M65,35 Q45,65 25,80", number: 2, startPoint: [65, 35] },
    ],
    description: "①横から下へ折れる、②左下へのはらいの順番で書きます",
  },
  ケ: {
    strokes: [
      { path: "M30,20 Q25,40 20,55", number: 1, startPoint: [30, 20] },
      { path: "M30,35 L70,35 L70,50", number: 2, startPoint: [30, 35] },
      { path: "M55,30 Q50,65 35,80", number: 3, startPoint: [55, 30] },
    ],
    description: "①左へのはらい、②横から下へ折れる、③左下へのはらいの順番で書きます",
  },
  コ: {
    strokes: [
      { path: "M25,25 L75,25 L75,75", number: 1, startPoint: [25, 25] },
      { path: "M25,75 L75,75", number: 2, startPoint: [25, 75] },
    ],
    description: "①横から下へ折れる、②下の横線の順番で書きます",
  },
};

// 行ごとのカラーマッピング
export const rowColors = {
  ア行: "#FF6B9D", // ピンク系
  カ行: "#4ECDC4", // ターコイズ系
  サ行: "#45B7D1", // ブルー系
  タ行: "#96CEB4", // グリーン系
  ナ行: "#FFEAA7", // イエロー系
  ハ行: "#DDA0DD", // パープル系
  マ行: "#F8C471", // オレンジ系
  ヤ行: "#AEB6BF", // グレー系
  ラ行: "#85C1E9", // ライトブルー系
  ワ行: "#F5B7B1", // ライトピンク系
};

export const katakanaData: KatakanaItem[] = [
  // ア行
  {
    id: "a",
    character: "ア",
    word: "アイスクリーム",
    reading: "アイスクリーム",
    color: rowColors["ア行"],
    row: "ア行",
    image: "/icon/50-sounds/1.png",
  },
  {
    id: "i",
    character: "イ",
    word: "イルカ",
    reading: "イルカ",
    color: rowColors["ア行"],
    row: "ア行",
    image: "/icon/50-sounds/2.png",
  },
  {
    id: "u",
    character: "ウ",
    word: "ウサギ",
    reading: "ウサギ",
    color: rowColors["ア行"],
    row: "ア行",
    image: "/icon/50-sounds/3.png",
  },
  {
    id: "e",
    character: "エ",
    word: "エプロン",
    reading: "エプロン",
    color: rowColors["ア行"],
    row: "ア行",
    image: "/icon/50-sounds/4.png",
  },
  {
    id: "o",
    character: "オ",
    word: "オレンジ",
    reading: "オレンジ",
    color: rowColors["ア行"],
    row: "ア行",
    image: "/icon/50-sounds/5.png",
  },

  // カ行
  {
    id: "ka",
    character: "カ",
    word: "カメラ",
    reading: "カメラ",
    color: rowColors["カ行"],
    row: "カ行",
    image: "/icon/50-sounds/6.png",
  },
  {
    id: "ki",
    character: "キ",
    word: "キウイ",
    reading: "キウイ",
    color: rowColors["カ行"],
    row: "カ行",
    image: "/icon/50-sounds/7.png",
  },
  {
    id: "ku",
    character: "ク",
    word: "クッキー",
    reading: "クッキー",
    color: rowColors["カ行"],
    row: "カ行",
    image: "/icon/50-sounds/8.png",
  },
  {
    id: "ke",
    character: "ケ",
    word: "ケーキ",
    reading: "ケーキ",
    color: rowColors["カ行"],
    row: "カ行",
    image: "/icon/50-sounds/9.png",
  },
  {
    id: "ko",
    character: "コ",
    word: "コアラ",
    reading: "コアラ",
    color: rowColors["カ行"],
    row: "カ行",
    image: "/icon/50-sounds/10.png",
  },

  // サ行
  {
    id: "sa",
    character: "サ",
    word: "サッカー",
    reading: "サッカー",
    color: rowColors["サ行"],
    row: "サ行",
    image: "/icon/50-sounds/11.png",
  },
  {
    id: "shi",
    character: "シ",
    word: "シート",
    reading: "シート",
    color: rowColors["サ行"],
    row: "サ行",
    image: "/icon/50-sounds/12.png",
  },
  {
    id: "su",
    character: "ス",
    word: "スカート",
    reading: "スカート",
    color: rowColors["サ行"],
    row: "サ行",
    image: "/icon/50-sounds/13.png",
  },
  {
    id: "se",
    character: "セ",
    word: "セーター",
    reading: "セーター",
    color: rowColors["サ行"],
    row: "サ行",
    image: "/icon/50-sounds/14.png",
  },
  {
    id: "so",
    character: "ソ",
    word: "ソーセージ",
    reading: "ソーセージ",
    color: rowColors["サ行"],
    row: "サ行",
    image: "/icon/50-sounds/15.png",
  },

  // タ行
  {
    id: "ta",
    character: "タ",
    word: "タンポポ",
    reading: "タンポポ",
    color: rowColors["タ行"],
    row: "タ行",
    image: "/icon/50-sounds/16.png",
  },
  {
    id: "chi",
    character: "チ",
    word: "チョコレート",
    reading: "チョコレート",
    color: rowColors["タ行"],
    row: "タ行",
    image: "/icon/50-sounds/17.png",
  },
  {
    id: "tsu",
    character: "ツ",
    word: "ツバメ",
    reading: "ツバメ",
    color: rowColors["タ行"],
    row: "タ行",
    image: "/icon/50-sounds/18.png",
  },
  {
    id: "te",
    character: "テ",
    word: "テニス",
    reading: "テニス",
    color: rowColors["タ行"],
    row: "タ行",
    image: "/icon/50-sounds/19.png",
  },
  {
    id: "to",
    character: "ト",
    word: "トイレ",
    reading: "トイレ",
    color: rowColors["タ行"],
    row: "タ行",
    image: "/icon/50-sounds/20.png",
  },

  // ナ行
  {
    id: "na",
    character: "ナ",
    word: "ナイフ",
    reading: "ナイフ",
    color: rowColors["ナ行"],
    row: "ナ行",
    image: "/icon/50-sounds/21.png",
  },
  {
    id: "ni",
    character: "ニ",
    word: "ニワトリ",
    reading: "ニワトリ",
    color: rowColors["ナ行"],
    row: "ナ行",
    image: "/icon/50-sounds/22.png",
  },
  {
    id: "nu",
    character: "ヌ",
    word: "ヌイグルミ",
    reading: "ヌイグルミ",
    color: rowColors["ナ行"],
    row: "ナ行",
    image: "/icon/50-sounds/23.png",
  },
  {
    id: "ne",
    character: "ネ",
    word: "ネズミ",
    reading: "ネズミ",
    color: rowColors["ナ行"],
    row: "ナ行",
    image: "/icon/50-sounds/24.png",
  },
  {
    id: "no",
    character: "ノ",
    word: "ノート",
    reading: "ノート",
    color: rowColors["ナ行"],
    row: "ナ行",
    image: "/icon/50-sounds/25.png",
  },

  // ハ行
  {
    id: "ha",
    character: "ハ",
    word: "ハーモニカ",
    reading: "ハーモニカ",
    color: rowColors["ハ行"],
    row: "ハ行",
    image: "/icon/50-sounds/26.png",
  },
  {
    id: "hi",
    character: "ヒ",
    word: "ヒーロー",
    reading: "ヒーロー",
    color: rowColors["ハ行"],
    row: "ハ行",
    image: "/icon/50-sounds/27.png",
  },
  {
    id: "fu",
    character: "フ",
    word: "フライパン",
    reading: "フライパン",
    color: rowColors["ハ行"],
    row: "ハ行",
    image: "/icon/50-sounds/28.png",
  },
  {
    id: "he",
    character: "ヘ",
    word: "ヘリコプター",
    reading: "ヘリコプター",
    color: rowColors["ハ行"],
    row: "ハ行",
    image: "/icon/50-sounds/29.png",
  },
  {
    id: "ho",
    character: "ホ",
    word: "ホットケーキ",
    reading: "ホットケーキ",
    color: rowColors["ハ行"],
    row: "ハ行",
    image: "/icon/50-sounds/30.png",
  },

  // マ行
  {
    id: "ma",
    character: "マ",
    word: "マフラー",
    reading: "マフラー",
    color: rowColors["マ行"],
    row: "マ行",
    image: "/icon/50-sounds/31.png",
  },
  {
    id: "mi",
    character: "ミ",
    word: "ミルク",
    reading: "ミルク",
    color: rowColors["マ行"],
    row: "マ行",
    image: "/icon/50-sounds/32.png",
  },
  {
    id: "mu",
    character: "ム",
    word: "ムササビ",
    reading: "ムササビ",
    color: rowColors["マ行"],
    row: "マ行",
    image: "/icon/50-sounds/33.png",
  },
  {
    id: "me",
    character: "メ",
    word: "メロン",
    reading: "メロン",
    color: rowColors["マ行"],
    row: "マ行",
    image: "/icon/50-sounds/34.png",
  },
  {
    id: "mo",
    character: "モ",
    word: "モノレール",
    reading: "モノレール",
    color: rowColors["マ行"],
    row: "マ行",
    image: "/icon/50-sounds/35.png",
  },

  // ヤ行
  {
    id: "ya",
    character: "ヤ",
    word: "ヤドカリ",
    reading: "ヤドカリ",
    color: rowColors["ヤ行"],
    row: "ヤ行",
    image: "/icon/50-sounds/36.png",
  },
  {
    id: "yu",
    character: "ユ",
    word: "ユリ",
    reading: "ユリ",
    color: rowColors["ヤ行"],
    row: "ヤ行",
    image: "/icon/50-sounds/37.png",
  },
  {
    id: "yo",
    character: "ヨ",
    word: "ヨット",
    reading: "ヨット",
    color: rowColors["ヤ行"],
    row: "ヤ行",
    image: "/icon/50-sounds/38.png",
  },

  // ラ行
  {
    id: "ra",
    character: "ラ",
    word: "ラーメン",
    reading: "ラーメン",
    color: rowColors["ラ行"],
    row: "ラ行",
    image: "/icon/50-sounds/39.png",
  },
  {
    id: "ri",
    character: "リ",
    word: "リモコン",
    reading: "リモコン",
    color: rowColors["ラ行"],
    row: "ラ行",
    image: "/icon/50-sounds/40.png",
  },
  {
    id: "ru",
    character: "ル",
    word: "ルビー",
    reading: "ルビー",
    color: rowColors["ラ行"],
    row: "ラ行",
    image: "/icon/50-sounds/41.png",
  },
  {
    id: "re",
    character: "レ",
    word: "レモン",
    reading: "レモン",
    color: rowColors["ラ行"],
    row: "ラ行",
    image: "/icon/50-sounds/42.png",
  },
  {
    id: "ro",
    character: "ロ",
    word: "ロケット",
    reading: "ロケット",
    color: rowColors["ラ行"],
    row: "ラ行",
    image: "/icon/50-sounds/43.png",
  },

  // ワ行
  {
    id: "wa",
    character: "ワ",
    word: "ワニ",
    reading: "ワニ",
    color: rowColors["ワ行"],
    row: "ワ行",
    image: "/icon/50-sounds/44.png",
  },
  {
    id: "wo",
    character: "ヲ",
    word: "テヲアラウ",
    reading: "テヲアラウ",
    color: rowColors["ワ行"],
    row: "ワ行",
    image: "/icon/50-sounds/45.png",
  },
  {
    id: "n",
    character: "ン",
    word: "パンダ",
    reading: "パンダ",
    color: rowColors["ワ行"],
    row: "ワ行",
    image: "/icon/50-sounds/46.png",
  },
];
