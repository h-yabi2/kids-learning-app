export interface HiraganaItem {
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
  あ: {
    strokes: [
      { path: "M50,20 Q80,40 70,80", number: 1, startPoint: [50, 20] },
      { path: "M30,50 Q50,30 80,50", number: 2, startPoint: [30, 50] },
    ],
    description: "①横線から②縦線の順番で書きます",
  },
  い: {
    strokes: [
      { path: "M40,20 L40,80", number: 1, startPoint: [40, 20] },
      { path: "M60,30 Q70,50 60,70", number: 2, startPoint: [60, 30] },
    ],
    description: "①縦線から②右の曲線の順番で書きます",
  },
  う: {
    strokes: [
      { path: "M30,30 Q50,20 70,40", number: 1, startPoint: [30, 30] },
      { path: "M50,40 Q60,60 40,70", number: 2, startPoint: [50, 40] },
    ],
    description: "①上から②下へ順番に書きます",
  },
  え: {
    strokes: [
      { path: "M30,30 L70,30", number: 1, startPoint: [30, 30] },
      { path: "M30,50 L60,50", number: 2, startPoint: [30, 50] },
      { path: "M50,20 L50,70", number: 3, startPoint: [50, 20] },
    ],
    description: "①横線、②横線、③縦線の順番で書きます",
  },
  お: {
    strokes: [
      { path: "M30,25 L70,25", number: 1, startPoint: [30, 25] },
      { path: "M30,45 L60,45", number: 2, startPoint: [30, 45] },
      { path: "M50,15 L50,75", number: 3, startPoint: [50, 15] },
      { path: "M65,35 Q75,55 65,70", number: 4, startPoint: [65, 35] },
    ],
    description: "①横線、②横線、③縦線、④右の曲線の順番で書きます",
  },
  か: {
    strokes: [
      { path: "M30,25 L70,25", number: 1, startPoint: [30, 25] },
      { path: "M50,15 L50,45", number: 2, startPoint: [50, 15] },
      { path: "M30,55 Q50,45 70,65", number: 3, startPoint: [30, 55] },
    ],
    description: "①横線、②縦線、③右はらいの順番で書きます",
  },
  き: {
    strokes: [
      { path: "M30,20 Q50,15 70,25", number: 1, startPoint: [30, 20] },
      { path: "M25,35 L75,35", number: 2, startPoint: [25, 35] },
      { path: "M50,10 L50,80", number: 3, startPoint: [50, 10] },
    ],
    description: "①上の横線、②下の横線、③縦線の順番で書きます",
  },
  く: {
    strokes: [{ path: "M60,25 Q40,50 60,75", number: 1, startPoint: [60, 25] }],
    description: "①一画で書きます",
  },
  け: {
    strokes: [
      { path: "M35,25 L65,25", number: 1, startPoint: [35, 25] },
      { path: "M50,15 L50,45", number: 2, startPoint: [50, 15] },
      { path: "M30,55 Q50,45 70,65", number: 3, startPoint: [30, 55] },
    ],
    description: "①横線、②縦線、③右はらいの順番で書きます",
  },
  こ: {
    strokes: [
      { path: "M30,30 L70,30", number: 1, startPoint: [30, 30] },
      { path: "M30,60 Q50,50 70,60", number: 2, startPoint: [30, 60] },
    ],
    description: "①横線、②下の曲線の順番で書きます",
  },
};

// 行ごとのカラーマッピング
export const rowColors = {
  あ行: "#FF6B9D", // ピンク系
  か行: "#4ECDC4", // ターコイズ系
  さ行: "#45B7D1", // ブルー系
  た行: "#96CEB4", // グリーン系
  な行: "#FFEAA7", // イエロー系
  は行: "#DDA0DD", // パープル系
  ま行: "#F8C471", // オレンジ系
  や行: "#AEB6BF", // グレー系
  ら行: "#85C1E9", // ライトブルー系
  わ行: "#F5B7B1", // ライトピンク系
};

export const hiraganaData: HiraganaItem[] = [
  // あ行
  {
    id: "a",
    character: "あ",
    word: "あいすくりーむ",
    reading: "あいすくりーむ",
    color: rowColors["あ行"],
    row: "あ行",
    image: "/icon/50-sounds/1.png",
  },
  {
    id: "i",
    character: "い",
    word: "いるか",
    reading: "いるか",
    color: rowColors["あ行"],
    row: "あ行",
    image: "/icon/50-sounds/2.png",
  },
  {
    id: "u",
    character: "う",
    word: "うさぎ",
    reading: "うさぎ",
    color: rowColors["あ行"],
    row: "あ行",
    image: "/icon/50-sounds/3.png",
  },
  {
    id: "e",
    character: "え",
    word: "えぷろん",
    reading: "えぷろん",
    color: rowColors["あ行"],
    row: "あ行",
    image: "/icon/50-sounds/4.png",
  },
  {
    id: "o",
    character: "お",
    word: "おれんじ",
    reading: "おれんじ",
    color: rowColors["あ行"],
    row: "あ行",
    image: "/icon/50-sounds/5.png",
  },

  // か行
  {
    id: "ka",
    character: "か",
    word: "かめら",
    reading: "かめら",
    color: rowColors["か行"],
    row: "か行",
    image: "/icon/50-sounds/6.png",
  },
  {
    id: "ki",
    character: "き",
    word: "きうい",
    reading: "きうい",
    color: rowColors["か行"],
    row: "か行",
    image: "/icon/50-sounds/7.png",
  },
  {
    id: "ku",
    character: "く",
    word: "くっきー",
    reading: "くっきー",
    color: rowColors["か行"],
    row: "か行",
    image: "/icon/50-sounds/8.png",
  },
  {
    id: "ke",
    character: "け",
    word: "けーき",
    reading: "けーき",
    color: rowColors["か行"],
    row: "か行",
    image: "/icon/50-sounds/9.png",
  },
  {
    id: "ko",
    character: "こ",
    word: "こあら",
    reading: "こあら",
    color: rowColors["か行"],
    row: "か行",
    image: "/icon/50-sounds/10.png",
  },

  // さ行
  {
    id: "sa",
    character: "さ",
    word: "さっかー",
    reading: "さっかー",
    color: rowColors["さ行"],
    row: "さ行",
    image: "/icon/50-sounds/11.png",
  },
  {
    id: "shi",
    character: "し",
    word: "しーと",
    reading: "しーと",
    color: rowColors["さ行"],
    row: "さ行",
    image: "/icon/50-sounds/12.png",
  },
  {
    id: "su",
    character: "す",
    word: "すかーと",
    reading: "すかーと",
    color: rowColors["さ行"],
    row: "さ行",
    image: "/icon/50-sounds/13.png",
  },
  {
    id: "se",
    character: "せ",
    word: "せーたー",
    reading: "せーたー",
    color: rowColors["さ行"],
    row: "さ行",
    image: "/icon/50-sounds/14.png",
  },
  {
    id: "so",
    character: "そ",
    word: "そーせーじ",
    reading: "そーせーじ",
    color: rowColors["さ行"],
    row: "さ行",
    image: "/icon/50-sounds/15.png",
  },

  // た行
  {
    id: "ta",
    character: "た",
    word: "たんぽぽ",
    reading: "たんぽぽ",
    color: rowColors["た行"],
    row: "た行",
    image: "/icon/50-sounds/16.png",
  },
  {
    id: "chi",
    character: "ち",
    word: "ちょこれーと",
    reading: "ちょこれーと",
    color: rowColors["た行"],
    row: "た行",
    image: "/icon/50-sounds/17.png",
  },
  {
    id: "tsu",
    character: "つ",
    word: "つばめ",
    reading: "つばめ",
    color: rowColors["た行"],
    row: "た行",
    image: "/icon/50-sounds/18.png",
  },
  {
    id: "te",
    character: "て",
    word: "てにす",
    reading: "てにす",
    color: rowColors["た行"],
    row: "た行",
    image: "/icon/50-sounds/19.png",
  },
  {
    id: "to",
    character: "と",
    word: "といれ",
    reading: "といれ",
    color: rowColors["た行"],
    row: "た行",
    image: "/icon/50-sounds/20.png",
  },

  // な行
  {
    id: "na",
    character: "な",
    word: "ないふ",
    reading: "ないふ",
    color: rowColors["な行"],
    row: "な行",
    image: "/icon/50-sounds/21.png",
  },
  {
    id: "ni",
    character: "に",
    word: "にわとり",
    reading: "にわとり",
    color: rowColors["な行"],
    row: "な行",
    image: "/icon/50-sounds/22.png",
  },
  {
    id: "nu",
    character: "ぬ",
    word: "ぬいぐるみ",
    reading: "ぬいぐるみ",
    color: rowColors["な行"],
    row: "な行",
    image: "/icon/50-sounds/23.png",
  },
  {
    id: "ne",
    character: "ね",
    word: "ねずみ",
    reading: "ねずみ",
    color: rowColors["な行"],
    row: "な行",
    image: "/icon/50-sounds/24.png",
  },
  {
    id: "no",
    character: "の",
    word: "のーと",
    reading: "のーと",
    color: rowColors["な行"],
    row: "な行",
    image: "/icon/50-sounds/25.png",
  },

  // は行
  {
    id: "ha",
    character: "は",
    word: "はーもにか",
    reading: "はーもにか",
    color: rowColors["は行"],
    row: "は行",
    image: "/icon/50-sounds/26.png",
  },
  {
    id: "hi",
    character: "ひ",
    word: "ひーろー",
    reading: "ひーろー",
    color: rowColors["は行"],
    row: "は行",
    image: "/icon/50-sounds/27.png",
  },
  {
    id: "fu",
    character: "ふ",
    word: "ふらいぱん",
    reading: "ふらいぱん",
    color: rowColors["は行"],
    row: "は行",
    image: "/icon/50-sounds/28.png",
  },
  {
    id: "he",
    character: "へ",
    word: "へりこぷたー",
    reading: "へりこぷたー",
    color: rowColors["は行"],
    row: "は行",
    image: "/icon/50-sounds/29.png",
  },
  {
    id: "ho",
    character: "ほ",
    word: "ほっとけーき",
    reading: "ほっとけーき",
    color: rowColors["は行"],
    row: "は行",
    image: "/icon/50-sounds/30.png",
  },

  // ま行
  {
    id: "ma",
    character: "ま",
    word: "まふらー",
    reading: "まふらー",
    color: rowColors["ま行"],
    row: "ま行",
    image: "/icon/50-sounds/31.png",
  },
  {
    id: "mi",
    character: "み",
    word: "みるく",
    reading: "みるく",
    color: rowColors["ま行"],
    row: "ま行",
    image: "/icon/50-sounds/32.png",
  },
  {
    id: "mu",
    character: "む",
    word: "むささび",
    reading: "むささび",
    color: rowColors["ま行"],
    row: "ま行",
    image: "/icon/50-sounds/33.png",
  },
  {
    id: "me",
    character: "め",
    word: "めろん",
    reading: "めろん",
    color: rowColors["ま行"],
    row: "ま行",
    image: "/icon/50-sounds/34.png",
  },
  {
    id: "mo",
    character: "も",
    word: "ものれーる",
    reading: "ものれーる",
    color: rowColors["ま行"],
    row: "ま行",
    image: "/icon/50-sounds/35.png",
  },

  // や行
  {
    id: "ya",
    character: "や",
    word: "やどかり",
    reading: "やどかり",
    color: rowColors["や行"],
    row: "や行",
    image: "/icon/50-sounds/36.png",
  },
  {
    id: "yu",
    character: "ゆ",
    word: "ゆり",
    reading: "ゆり",
    color: rowColors["や行"],
    row: "や行",
    image: "/icon/50-sounds/37.png",
  },
  {
    id: "yo",
    character: "よ",
    word: "よっと",
    reading: "よっと",
    color: rowColors["や行"],
    row: "や行",
    image: "/icon/50-sounds/38.png",
  },

  // ら行
  {
    id: "ra",
    character: "ら",
    word: "らーめん",
    reading: "らーめん",
    color: rowColors["ら行"],
    row: "ら行",
    image: "/icon/50-sounds/39.png",
  },
  {
    id: "ri",
    character: "り",
    word: "りもこん",
    reading: "りもこん",
    color: rowColors["ら行"],
    row: "ら行",
    image: "/icon/50-sounds/40.png",
  },
  {
    id: "ru",
    character: "る",
    word: "るびー",
    reading: "るびー",
    color: rowColors["ら行"],
    row: "ら行",
    image: "/icon/50-sounds/41.png",
  },
  {
    id: "re",
    character: "れ",
    word: "れもん",
    reading: "れもん",
    color: rowColors["ら行"],
    row: "ら行",
    image: "/icon/50-sounds/42.png",
  },
  {
    id: "ro",
    character: "ろ",
    word: "ろけっと",
    reading: "ろけっと",
    color: rowColors["ら行"],
    row: "ら行",
    image: "/icon/50-sounds/43.png",
  },

  // わ行
  {
    id: "wa",
    character: "わ",
    word: "わに",
    reading: "わに",
    color: rowColors["わ行"],
    row: "わ行",
    image: "/icon/50-sounds/44.png",
  },
  {
    id: "wo",
    character: "を",
    word: "てをあらう",
    reading: "てをあらう",
    color: rowColors["わ行"],
    row: "わ行",
    image: "/icon/50-sounds/45.png",
  },
  {
    id: "n",
    character: "ん",
    word: "ぱんだ",
    reading: "ぱんだ",
    color: rowColors["わ行"],
    row: "わ行",
    image: "/icon/50-sounds/46.png",
  },
];
