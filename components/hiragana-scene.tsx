"use client";

import { useState } from "react";

interface HiraganaItem {
  id: string;
  character: string;
  word: string;
  reading: string;
  color: string;
  row: string;
  image?: string;
}

// 行ごとのカラーマッピング
const rowColors = {
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

const hiraganaData: HiraganaItem[] = [
  // あ行
  {
    id: "a",
    character: "あ",
    word: "あいすくりーむ",
    reading: "あいすくりーむ",
    color: rowColors["あ行"],
    row: "あ行",
    image: "/icon/50-sounds/あいすくりーむ.png",
  },
  {
    id: "i",
    character: "い",
    word: "いるか",
    reading: "いるか",
    color: rowColors["あ行"],
    row: "あ行",
    image: "/icon/50-sounds/いるか.png",
  },
  {
    id: "u",
    character: "う",
    word: "うさぎ",
    reading: "うさぎ",
    color: rowColors["あ行"],
    row: "あ行",
    image: "/icon/50-sounds/うさぎ.png",
  },
  {
    id: "e",
    character: "え",
    word: "えぷろん",
    reading: "えぷろん",
    color: rowColors["あ行"],
    row: "あ行",
    image: "/icon/50-sounds/エプロン.png",
  },
  {
    id: "o",
    character: "お",
    word: "おれんじ",
    reading: "おれんじ",
    color: rowColors["あ行"],
    row: "あ行",
    image: "/icon/50-sounds/おれんじ.png",
  },

  // か行
  {
    id: "ka",
    character: "か",
    word: "かめら",
    reading: "かめら",
    color: rowColors["か行"],
    row: "か行",
    image: "/icon/50-sounds/かめら.png",
  },
  {
    id: "ki",
    character: "き",
    word: "きうい",
    reading: "きうい",
    color: rowColors["か行"],
    row: "か行",
    image: "/icon/50-sounds/きうい.png",
  },
  {
    id: "ku",
    character: "く",
    word: "くっきー",
    reading: "くっきー",
    color: rowColors["か行"],
    row: "か行",
    image: "/icon/50-sounds/くっきー.png",
  },
  {
    id: "ke",
    character: "け",
    word: "けーき",
    reading: "けーき",
    color: rowColors["か行"],
    row: "か行",
    image: "/icon/50-sounds/けーき.png",
  },
  {
    id: "ko",
    character: "こ",
    word: "こあら",
    reading: "こあら",
    color: rowColors["か行"],
    row: "か行",
    image: "/icon/50-sounds/こあら.png",
  },

  // さ行
  {
    id: "sa",
    character: "さ",
    word: "さっかー",
    reading: "さっかー",
    color: rowColors["さ行"],
    row: "さ行",
    image: "/icon/50-sounds/さっかー.png",
  },
  {
    id: "shi",
    character: "し",
    word: "しーと",
    reading: "しーと",
    color: rowColors["さ行"],
    row: "さ行",
    image: "/icon/50-sounds/しーと.png",
  },
  {
    id: "su",
    character: "す",
    word: "すかーと",
    reading: "すかーと",
    color: rowColors["さ行"],
    row: "さ行",
    image: "/icon/50-sounds/すかーと.png",
  },
  {
    id: "se",
    character: "せ",
    word: "せーたー",
    reading: "せーたー",
    color: rowColors["さ行"],
    row: "さ行",
    image: "/icon/50-sounds/せーたー.png",
  },
  {
    id: "so",
    character: "そ",
    word: "そーせーじ",
    reading: "そーせーじ",
    color: rowColors["さ行"],
    row: "さ行",
    image: "/icon/50-sounds/そーせーじ.png",
  },

  // た行
  {
    id: "ta",
    character: "た",
    word: "たんぽぽ",
    reading: "たんぽぽ",
    color: rowColors["た行"],
    row: "た行",
    image: "/icon/50-sounds/たんぽぽ.png",
  },
  {
    id: "chi",
    character: "ち",
    word: "ちょこれーと",
    reading: "ちょこれーと",
    color: rowColors["た行"],
    row: "た行",
    image: "/icon/50-sounds/ちょこれーと.png",
  },
  {
    id: "tsu",
    character: "つ",
    word: "つばめ",
    reading: "つばめ",
    color: rowColors["た行"],
    row: "た行",
    image: "/icon/50-sounds/つばめ.png",
  },
  {
    id: "te",
    character: "て",
    word: "てにす",
    reading: "てにす",
    color: rowColors["た行"],
    row: "た行",
    image: "/icon/50-sounds/てにす.png",
  },
  {
    id: "to",
    character: "と",
    word: "といれ",
    reading: "といれ",
    color: rowColors["た行"],
    row: "た行",
    image: "/icon/50-sounds/といれ.png",
  },

  // な行
  {
    id: "na",
    character: "な",
    word: "ないふ",
    reading: "ないふ",
    color: rowColors["な行"],
    row: "な行",
    image: "/icon/50-sounds/ないふ.png",
  },
  {
    id: "ni",
    character: "に",
    word: "にわとり",
    reading: "にわとり",
    color: rowColors["な行"],
    row: "な行",
    image: "/icon/50-sounds/にわとり.png",
  },
  {
    id: "nu",
    character: "ぬ",
    word: "ぬいぐるみ",
    reading: "ぬいぐるみ",
    color: rowColors["な行"],
    row: "な行",
    image: "/icon/50-sounds/ぬいぐるみ.png",
  },
  {
    id: "ne",
    character: "ね",
    word: "ねずみ",
    reading: "ねずみ",
    color: rowColors["な行"],
    row: "な行",
    image: "/icon/50-sounds/ねずみ.png",
  },
  {
    id: "no",
    character: "の",
    word: "のーと",
    reading: "のーと",
    color: rowColors["な行"],
    row: "な行",
    image: "/icon/50-sounds/のーと.png",
  },

  // は行
  {
    id: "ha",
    character: "は",
    word: "はむすたー",
    reading: "はむすたー",
    color: rowColors["は行"],
    row: "は行",
    image: "/icon/50-sounds/81-は.png",
  },
  {
    id: "hi",
    character: "ひ",
    word: "ひつじ",
    reading: "ひつじ",
    color: rowColors["は行"],
    row: "は行",
    image: "/icon/50-sounds/82-ひ.png",
  },
  {
    id: "fu",
    character: "ふ",
    word: "ふらいぱん",
    reading: "ふらいぱん",
    color: rowColors["は行"],
    row: "は行",
    image: "/icon/50-sounds/83-ふ.png",
  },
  {
    id: "he",
    character: "へ",
    word: "へりこぷたー",
    reading: "へりこぷたー",
    color: rowColors["は行"],
    row: "は行",
    image: "/icon/50-sounds/84-へ.png",
  },
  {
    id: "ho",
    character: "ほ",
    word: "ほっとけーき",
    reading: "ほっとけーき",
    color: rowColors["は行"],
    row: "は行",
    image: "/icon/50-sounds/85-ほ.png",
  },

  // ま行
  {
    id: "ma",
    character: "ま",
    word: "まいく",
    reading: "まいく",
    color: rowColors["ま行"],
    row: "ま行",
    image: "/icon/50-sounds/86-ま.png",
  },
  {
    id: "mi",
    character: "み",
    word: "みるく",
    reading: "みるく",
    color: rowColors["ま行"],
    row: "ま行",
    image: "/icon/50-sounds/87-み.png",
  },
  {
    id: "mu",
    character: "む",
    word: "むし",
    reading: "むし",
    color: rowColors["ま行"],
    row: "ま行",
    image: "/icon/50-sounds/88-む.png",
  },
  {
    id: "me",
    character: "め",
    word: "めろん",
    reading: "めろん",
    color: rowColors["ま行"],
    row: "ま行",
    image: "/icon/50-sounds/89-め.png",
  },
  {
    id: "mo",
    character: "も",
    word: "もも",
    reading: "もも",
    color: rowColors["ま行"],
    row: "ま行",
    image: "/icon/50-sounds/90-も.png",
  },

  // や行
  {
    id: "ya",
    character: "や",
    word: "やどかり",
    reading: "やどかり",
    color: rowColors["や行"],
    row: "や行",
    image: "/icon/50-sounds/91-や.png",
  },
  {
    id: "yu",
    character: "ゆ",
    word: "ゆり",
    reading: "ゆり",
    color: rowColors["や行"],
    row: "や行",
    image: "/icon/50-sounds/92-ゆ.png",
  },
  {
    id: "yo",
    character: "よ",
    word: "よっと",
    reading: "よっと",
    color: rowColors["や行"],
    row: "や行",
    image: "/icon/50-sounds/93-よ.png",
  },

  // ら行
  {
    id: "ra",
    character: "ら",
    word: "らじお",
    reading: "らじお",
    color: rowColors["ら行"],
    row: "ら行",
    image: "/icon/50-sounds/ら.png",
  },
  {
    id: "ri",
    character: "り",
    word: "りもこん",
    reading: "りもこん",
    color: rowColors["ら行"],
    row: "ら行",
    image: "/icon/50-sounds/り.png",
  },
  {
    id: "ru",
    character: "る",
    word: "るびー",
    reading: "るびー",
    color: rowColors["ら行"],
    row: "ら行",
    image: "/icon/50-sounds/る.png",
  },
  {
    id: "re",
    character: "れ",
    word: "れたす",
    reading: "れたす",
    color: rowColors["ら行"],
    row: "ら行",
    image: "/icon/50-sounds/れ.png",
  },
  {
    id: "ro",
    character: "ろ",
    word: "ろば",
    reading: "ろば",
    color: rowColors["ら行"],
    row: "ら行",
    image: "/icon/50-sounds/ろ.png",
  },

  // わ行
  {
    id: "wa",
    character: "わ",
    word: "わに",
    reading: "わに",
    color: rowColors["わ行"],
    row: "わ行",
    image: "/icon/50-sounds/わ.png",
  },
  {
    id: "wo",
    character: "を",
    word: "を",
    reading: "を",
    color: rowColors["わ行"],
    row: "わ行",
    image: "/icon/50-sounds/を.png",
  },
  {
    id: "n",
    character: "ん",
    word: "ぱんだ",
    reading: "ぱんだ",
    color: rowColors["わ行"],
    row: "わ行",
    image: "/icon/50-sounds/ん.png",
  },
];

interface HiraganaSceneProps {
  onHiraganaClick: (item: HiraganaItem) => void;
}

export default function HiraganaScene({ onHiraganaClick }: HiraganaSceneProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );

  const handleCharacterClick = (item: HiraganaItem) => {
    setSelectedCharacter(item.id);
    onHiraganaClick(item);
    setTimeout(() => setSelectedCharacter(null), 1000);
  };

  // 各行ごとに縦に並べる（あ行、か行…や行、ら行、わ行）
  const rowsData = [
    hiraganaData.filter((item) => item.row === "あ行"),
    hiraganaData.filter((item) => item.row === "か行"),
    hiraganaData.filter((item) => item.row === "さ行"),
    hiraganaData.filter((item) => item.row === "た行"),
    hiraganaData.filter((item) => item.row === "な行"),
    hiraganaData.filter((item) => item.row === "は行"),
    hiraganaData.filter((item) => item.row === "ま行"),
    hiraganaData.filter((item) => item.row === "や行"),
    hiraganaData.filter((item) => item.row === "ら行"),
    hiraganaData.filter((item) => item.row === "わ行"),
  ];

  return (
    <div className="w-full">
      {/* Hiragana Grid: 各行ごとに縦並び、右から左 */}
      <div className="flex flex-row-reverse justify-center gap-6">
        {rowsData.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-8">
            {col.map((item, rowIdx) => (
              <div
                key={item.id}
                className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  selectedCharacter === item.id ? "scale-110 animate-pulse" : ""
                }`}
                onClick={() => handleCharacterClick(item)}
              >
                {/* メインブロック：ひらがな文字とアイコンを統合 */}
                <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-3 shadow-xl border-2 border-white/30">
                  <div className="flex items-center justify-center gap-3">
                    {/* ひらがな文字 */}
                    <div
                      className="w-16 h-16 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: item.color }}
                    >
                      <div className="text-2xl font-bold text-white drop-shadow-lg">
                        {item.character}
                      </div>
                      {selectedCharacter === item.id && (
                        <>
                          <div className="absolute top-1 right-1 text-yellow-300 animate-ping text-xs">
                            ✨
                          </div>
                          <div
                            className="absolute bottom-1 left-1 text-yellow-300 animate-ping text-xs"
                            style={{ animationDelay: "0.5s" }}
                          >
                            ✨
                          </div>
                        </>
                      )}
                    </div>

                    {/* アイコンと単語 */}
                    <div className="flex flex-col items-center gap-1">
                      {item.image && (
                        <div className="w-12 h-12 bg-white rounded-xl shadow-md border-2 border-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.word}
                            className="w-10 h-10 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
