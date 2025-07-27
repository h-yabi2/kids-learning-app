"use client";

import { useState } from "react";
import { hiraganaData, type HiraganaItem } from "@/lib/hiragana-data";

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
          <div key={colIdx} className="flex flex-col gap-4">
            {col.map((item, rowIdx) => (
              <div
                key={item.id}
                className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  selectedCharacter === item.id ? "scale-110 animate-pulse" : ""
                }`}
                onClick={() => handleCharacterClick(item)}
              >
                {/* メインブロック：ひらがな文字とアイコンを統合 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border-2 border-white/30">
                  <div className="flex items-center justify-center gap-1">
                    {/* ひらがな文字 */}
                    <div
                      className="w-14 h-14 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center relative overflow-hidden"
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
                        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.word}
                            className="w-10 h-10 object-cover rounded"
                          />
                        </div>
                      )}
                      {/* <span className="text-xs font-medium text-gray-700 text-center leading-tight max-w-16">
                        {item.word}
                      </span> */}
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
