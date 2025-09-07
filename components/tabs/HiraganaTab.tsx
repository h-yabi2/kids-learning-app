import HiraganaScene from "../hiragana-scene";
import React, { useRef, useCallback } from "react";

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

  // 「あかり」の特別データ
  const akariItem = {
    id: "akari",
    character: "あかり",
    word: "あかり",
    reading: "あかり",
    color: "#4A90E2", // ブルー系
    row: "特別",
    image: "/images/akari.png",
  };

  const hiraganaSceneRef = useRef<any>(null);

  // クリック効果音を生成する関数
  const playClickSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // クリック音の設定
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        audioContext.currentTime + 0.1
      ); // 400Hzに下がる

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // 音量
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      ); // フェードアウト

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log("効果音の再生に失敗しました:", error);
    }
  }, []);

  return (
    <>
      {/* 「こと」と「あかり」の特別表示 */}
      <div className="mb-8 text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* 「こと」の表示 */}
          <div
            className="inline-block bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              console.log("🔵 「こと」がクリックされました");
              playClickSound(); // クリック効果音を再生
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

          {/* 「あかり」の表示 */}
          <div
            className="inline-block bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              console.log("🔵 「あかり」がクリックされました");
              playClickSound(); // クリック効果音を再生
              onHiraganaClick(akariItem);
              // グローバル関数を呼び出してダイアログを開く
              console.log("📞 グローバルtriggerAkariClickを呼び出します");
              if ((window as any).triggerAkariClick) {
                (window as any).triggerAkariClick();
              } else {
                console.log("❌ グローバルtriggerAkariClickが見つかりません");
              }
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {akariItem.character}
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16">
                <img
                  src={akariItem.image}
                  alt={akariItem.word}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <HiraganaScene
        onHiraganaClick={onHiraganaClick}
        kotoItem={kotoItem}
        akariItem={akariItem}
      />
    </>
  );
};

export default HiraganaTab;
