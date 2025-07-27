import HiraganaScene from "../hiragana-scene";
import React, { useRef } from "react";

interface HiraganaTabProps {
  onHiraganaClick: (item: any) => void;
}

const HiraganaTab: React.FC<HiraganaTabProps> = ({ onHiraganaClick }) => {
  // 「こと」の特別データ
  const kotoItem = {
    id: "koto",
    character: "こと",
    word: "こと",
    reading: "こと",
    color: "#FF6B9D", // ピンク系
    row: "特別",
    image: "/images/koto.png",
  };

  const hiraganaSceneRef = useRef<any>(null);

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">ひらがな</h2>
        <p className="text-gray-600">
          ひらがなをタップして、ことばをおぼえよう！
        </p>
      </div>
      <HiraganaScene onHiraganaClick={onHiraganaClick} kotoItem={kotoItem} />
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          ひらがなをタップすると、ことばがきこえるよ！
        </p>
      </div>
      {/* 「こと」の特別表示 */}
      <div className="mt-6 text-center">
        <div
          className="inline-block bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
          onClick={() => {
            console.log("🔵 「こと」がクリックされました");
            onHiraganaClick(kotoItem);
            // グローバル関数を呼び出してダイアログを開く
            console.log("📞 グローバルtriggerKotoClickを呼び出します");
            if ((window as any).triggerKotoClick) {
              (window as any).triggerKotoClick();
            } else {
              console.log("❌ グローバルtriggerKotoClickが見つかりません");
            }
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {kotoItem.character}
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16">
              <img
                src={kotoItem.image}
                alt={kotoItem.word}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HiraganaTab;
