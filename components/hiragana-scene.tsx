"use client";

import { useState } from "react";

interface HiraganaItem {
  id: string;
  character: string;
  word: string;
  reading: string;
  color: string;
  row: string;
}

const hiraganaData: HiraganaItem[] = [
  // あ行
  {
    id: "a",
    character: "あ",
    word: "あいすくりーむ",
    reading: "あいすくりーむ",
    color: "#FF6B6B",
    row: "あ行",
  },
  {
    id: "i",
    character: "い",
    word: "いぬ",
    reading: "いぬ",
    color: "#4ECDC4",
    row: "あ行",
  },
  {
    id: "u",
    character: "う",
    word: "うさぎ",
    reading: "うさぎ",
    color: "#45B7D1",
    row: "あ行",
  },
  {
    id: "e",
    character: "え",
    word: "えぷろん",
    reading: "えぷろん",
    color: "#96CEB4",
    row: "あ行",
  },
  {
    id: "o",
    character: "お",
    word: "おれんじ",
    reading: "おれんじ",
    color: "#FFEAA7",
    row: "あ行",
  },

  // か行
  {
    id: "ka",
    character: "か",
    word: "かめら",
    reading: "かめら",
    color: "#DDA0DD",
    row: "か行",
  },
  {
    id: "ki",
    character: "き",
    word: "きりん",
    reading: "きりん",
    color: "#98D8C8",
    row: "か行",
  },
  {
    id: "ku",
    character: "く",
    word: "くま",
    reading: "くま",
    color: "#F7DC6F",
    row: "か行",
  },
  {
    id: "ke",
    character: "け",
    word: "けーき",
    reading: "けーき",
    color: "#BB8FCE",
    row: "か行",
  },
  {
    id: "ko",
    character: "こ",
    word: "こうもり",
    reading: "こうもり",
    color: "#85C1E9",
    row: "か行",
  },

  // さ行
  {
    id: "sa",
    character: "さ",
    word: "さる",
    reading: "さる",
    color: "#F8C471",
    row: "さ行",
  },
  {
    id: "shi",
    character: "し",
    word: "しーる",
    reading: "しーる",
    color: "#82E0AA",
    row: "さ行",
  },
  {
    id: "su",
    character: "す",
    word: "すかーと",
    reading: "すかーと",
    color: "#AED6F1",
    row: "さ行",
  },
  {
    id: "se",
    character: "せ",
    word: "せーたー",
    reading: "せーたー",
    color: "#F5B7B1",
    row: "さ行",
  },
  {
    id: "so",
    character: "そ",
    word: "そーせーじ",
    reading: "そーせーじ",
    color: "#D7BDE2",
    row: "さ行",
  },

  // た行
  {
    id: "ta",
    character: "た",
    word: "たけのこ",
    reading: "たけのこ",
    color: "#A9DFBF",
    row: "た行",
  },
  {
    id: "chi",
    character: "ち",
    word: "ちーず",
    reading: "ちーず",
    color: "#F9E79F",
    row: "た行",
  },
  {
    id: "tsu",
    character: "つ",
    word: "つばめ",
    reading: "つばめ",
    color: "#AEB6BF",
    row: "た行",
  },
  {
    id: "te",
    character: "て",
    word: "てんと",
    reading: "てんと",
    color: "#D5A6BD",
    row: "た行",
  },
  {
    id: "to",
    character: "と",
    word: "とらっく",
    reading: "とらっく",
    color: "#A3E4D7",
    row: "た行",
  },

  // な行
  {
    id: "na",
    character: "な",
    word: "なす",
    reading: "なす",
    color: "#D2B4DE",
    row: "な行",
  },
  {
    id: "ni",
    character: "に",
    word: "にんじん",
    reading: "にんじん",
    color: "#F8D7DA",
    row: "な行",
  },
  {
    id: "nu",
    character: "ぬ",
    word: "ぬりえ",
    reading: "ぬりえ",
    color: "#D1ECF1",
    row: "な行",
  },
  {
    id: "ne",
    character: "ね",
    word: "ねこ",
    reading: "ねこ",
    color: "#FCF3CF",
    row: "な行",
  },
  {
    id: "no",
    character: "の",
    word: "のーと",
    reading: "のーと",
    color: "#FADBD8",
    row: "な行",
  },

  // は行
  {
    id: "ha",
    character: "は",
    word: "はむすたー",
    reading: "はむすたー",
    color: "#E8DAEF",
    row: "は行",
  },
  {
    id: "hi",
    character: "ひ",
    word: "ひつじ",
    reading: "ひつじ",
    color: "#D5F4E6",
    row: "は行",
  },
  {
    id: "fu",
    character: "ふ",
    word: "ふらいぱん",
    reading: "ふらいぱん",
    color: "#FEF9E7",
    row: "は行",
  },
  {
    id: "he",
    character: "へ",
    word: "へりこぷたー",
    reading: "へりこぷたー",
    color: "#EBDEF0",
    row: "は行",
  },
  {
    id: "ho",
    character: "ほ",
    word: "ほっとけーき",
    reading: "ほっとけーき",
    color: "#D6EAF8",
    row: "は行",
  },

  // ま行
  {
    id: "ma",
    character: "ま",
    word: "まいく",
    reading: "まいく",
    color: "#FDEDEC",
    row: "ま行",
  },
  {
    id: "mi",
    character: "み",
    word: "みるく",
    reading: "みるく",
    color: "#EAF2F8",
    row: "ま行",
  },
  {
    id: "mu",
    character: "む",
    word: "むし",
    reading: "むし",
    color: "#E8F8F5",
    row: "ま行",
  },
  {
    id: "me",
    character: "め",
    word: "めろん",
    reading: "めろん",
    color: "#FEF5E7",
    row: "ま行",
  },
  {
    id: "mo",
    character: "も",
    word: "もも",
    reading: "もも",
    color: "#F4ECF7",
    row: "ま行",
  },

  // や行
  {
    id: "ya",
    character: "や",
    word: "やどかり",
    reading: "やどかり",
    color: "#E5E7E9",
    row: "や行",
  },
  {
    id: "yu",
    character: "ゆ",
    word: "ゆり",
    reading: "ゆり",
    color: "#D0ECE7",
    row: "や行",
  },
  {
    id: "yo",
    character: "よ",
    word: "よっと",
    reading: "よっと",
    color: "#F8F9F9",
    row: "や行",
  },

  // ら行
  {
    id: "ra",
    character: "ら",
    word: "らじお",
    reading: "らじお",
    color: "#FDEAA7",
    row: "ら行",
  },
  {
    id: "ri",
    character: "り",
    word: "りもこん",
    reading: "りもこん",
    color: "#D5DBDB",
    row: "ら行",
  },
  {
    id: "ru",
    character: "る",
    word: "るびー",
    reading: "るびー",
    color: "#F2D7D5",
    row: "ら行",
  },
  {
    id: "re",
    character: "れ",
    word: "れたす",
    reading: "れたす",
    color: "#D6DBDF",
    row: "ら行",
  },
  {
    id: "ro",
    character: "ろ",
    word: "ろば",
    reading: "ろば",
    color: "#E8F6F3",
    row: "ら行",
  },

  // わ行
  {
    id: "wa",
    character: "わ",
    word: "わに",
    reading: "わに",
    color: "#FDF2E9",
    row: "わ行",
  },
  {
    id: "wo",
    character: "を",
    word: "を",
    reading: "を",
    color: "#EAEDED",
    row: "わ行",
  },
  {
    id: "n",
    character: "ん",
    word: "ぱんだ",
    reading: "ぱんだ",
    color: "#E74C3C",
    row: "わ行",
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
      <div className="flex flex-row-reverse justify-center gap-3">
        {rowsData.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-3">
            {col.map((item, rowIdx) => (
              <div
                key={item.id}
                className={`relative cursor-pointer transform transition-all duration-300 hover:scale-110 ${
                  selectedCharacter === item.id ? "scale-125 animate-pulse" : ""
                }`}
                onClick={() => handleCharacterClick(item)}
              >
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
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.word}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
