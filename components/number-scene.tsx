"use client";

import { useState } from "react";

interface NumberItem {
  id: string;
  number: number;
  nameJapanese: string;
  nameEnglish: string;
  color: string;
}

const numbers: NumberItem[] = [
  {
    id: "1",
    number: 1,
    nameJapanese: "いち",
    nameEnglish: "one",
    color: "#FF6B6B",
  },
  {
    id: "2",
    number: 2,
    nameJapanese: "に",
    nameEnglish: "two",
    color: "#4ECDC4",
  },
  {
    id: "3",
    number: 3,
    nameJapanese: "さん",
    nameEnglish: "three",
    color: "#45B7D1",
  },
  {
    id: "4",
    number: 4,
    nameJapanese: "よん",
    nameEnglish: "four",
    color: "#96CEB4",
  },
  {
    id: "5",
    number: 5,
    nameJapanese: "ご",
    nameEnglish: "five",
    color: "#FFEAA7",
  },
  {
    id: "6",
    number: 6,
    nameJapanese: "ろく",
    nameEnglish: "six",
    color: "#DDA0DD",
  },
  {
    id: "7",
    number: 7,
    nameJapanese: "なな",
    nameEnglish: "seven",
    color: "#98D8C8",
  },
  {
    id: "8",
    number: 8,
    nameJapanese: "はち",
    nameEnglish: "eight",
    color: "#F7DC6F",
  },
  {
    id: "9",
    number: 9,
    nameJapanese: "きゅう",
    nameEnglish: "nine",
    color: "#BB8FCE",
  },
  {
    id: "10",
    number: 10,
    nameJapanese: "じゅう",
    nameEnglish: "ten",
    color: "#85C1E9",
  },
];

interface NumberSceneProps {
  onNumberClick: (number: NumberItem) => void;
}

export default function NumberScene({ onNumberClick }: NumberSceneProps) {
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

  const handleNumberClick = (number: NumberItem) => {
    console.log("[NumberScene] handleNumberClick", number);
    setSelectedNumber(number.id);
    onNumberClick(number);
    setTimeout(() => setSelectedNumber(null), 1000);
  };

  // Generate dots for visual counting
  const generateDots = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="w-3 h-3 bg-white rounded-full border-2 border-gray-300"
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ));
  };

  return (
    <div className="w-full">
      {/* Numbers Grid */}
      <div className="grid grid-cols-5 gap-6 justify-items-center">
        {numbers.map((number) => (
          <div
            key={number.id}
            className={`relative cursor-pointer transform transition-all duration-300 hover:scale-110 ${
              selectedNumber === number.id ? "scale-125 animate-pulse" : ""
            }`}
            onClick={() => handleNumberClick(number)}
          >
            {/* Number Card */}
            <div
              className="w-24 h-32 rounded-2xl shadow-lg border-4 border-white flex flex-col items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: number.color }}
            >
              {/* Number Display */}
              <div className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {number.number}
              </div>

              {/* Japanese Name */}
              <div className="text-sm font-bold text-white bg-black/20 px-2 py-1 rounded">
                {number.nameJapanese}
              </div>

              {/* Sparkle Effect */}
              {selectedNumber === number.id && (
                <>
                  <div className="absolute top-2 right-2 text-yellow-300 animate-ping">
                    ✨
                  </div>
                  <div
                    className="absolute bottom-2 left-2 text-yellow-300 animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  >
                    ✨
                  </div>
                </>
              )}
            </div>

            {/* Dots for counting */}
            <div className="mt-3 flex flex-wrap justify-center gap-1 max-w-24">
              {generateDots(number.number)}
            </div>

            {/* Hover tooltip */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {number.nameEnglish}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
