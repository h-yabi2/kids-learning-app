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

  // 「あゆむ」の特別データ
  const ayumuItem = {
    id: "ayumu",
    character: "あゆむ",
    word: "あゆむ",
    reading: "あゆむ",
    color: "#FF6B9D", // ピンク系
    row: "特別",
    image: "/images/ayumu.png",
  };

  // 「みおな」の特別データ
  const mionaItem = {
    id: "miona",
    character: "みおな",
    word: "みおな",
    reading: "みおな",
    color: "#9C27B0", // パープル系
    row: "特別",
    image: "/images/miona.png",
  };

  // 「みつき」の特別データ
  const mitsukiItem = {
    id: "mitsuki",
    character: "みつき",
    word: "みつき",
    reading: "みつき",
    color: "#FF9800", // オレンジ系
    row: "特別",
    image: "/images/mitsuki.png",
  };

  // 「やっちゃん」の特別データ
  const yattyanItem = {
    id: "yattyan",
    character: "やっちゃん",
    word: "やっちゃん",
    reading: "やっちゃん",
    color: "#4CAF50", // グリーン系
    row: "特別",
    image: "/images/yattyan.png",
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
      {/* 友達キャラクターの特別表示 */}
      <div className="mb-8 text-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 justify-center items-center">
          {/* 「こと」の表示 */}
          <div
            className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              console.log("🔵 「こと」がクリックされました");
              playClickSound();
              onHiraganaClick(kotoItem);
              if ((window as any).triggerKotoClick) {
                (window as any).triggerKotoClick();
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
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
              <div className="text-lg sm:text-xl font-bold text-white">
                {kotoItem.character}
              </div>
            </div>
          </div>

          {/* 「あかり」の表示 */}
          <div
            className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              console.log("🔵 「あかり」がクリックされました");
              playClickSound();
              onHiraganaClick(akariItem);
              if ((window as any).triggerAkariClick) {
                (window as any).triggerAkariClick();
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
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
              <div className="text-lg sm:text-xl font-bold text-white">
                {akariItem.character}
              </div>
            </div>
          </div>

          {/* 「あゆむ」の表示 */}
          <div
            className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              console.log("🔵 「あゆむ」がクリックされました");
              playClickSound();
              onHiraganaClick(ayumuItem);
              if ((window as any).triggerAyumuClick) {
                (window as any).triggerAyumuClick();
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16">
                <img
                  src={ayumuItem.image}
                  alt={ayumuItem.word}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="text-lg sm:text-xl font-bold text-white">
                {ayumuItem.character}
              </div>
            </div>
          </div>

          {/* 「みおな」の表示 */}
          <div
            className="bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              console.log("🔵 「みおな」がクリックされました");
              playClickSound();
              onHiraganaClick(mionaItem);
              if ((window as any).triggerMionaClick) {
                (window as any).triggerMionaClick();
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16">
                <img
                  src={mionaItem.image}
                  alt={mionaItem.word}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="text-lg sm:text-xl font-bold text-white">
                {mionaItem.character}
              </div>
            </div>
          </div>

          {/* 「みつき」の表示 */}
          <div
            className="bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              console.log("🔵 「みつき」がクリックされました");
              playClickSound();
              onHiraganaClick(mitsukiItem);
              if ((window as any).triggerMitsukiClick) {
                (window as any).triggerMitsukiClick();
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16">
                <img
                  src={mitsukiItem.image}
                  alt={mitsukiItem.word}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="text-lg sm:text-xl font-bold text-white">
                {mitsukiItem.character}
              </div>
            </div>
          </div>

          {/* 「やっちゃん」の表示 */}
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              console.log("🔵 「やっちゃん」がクリックされました");
              playClickSound();
              onHiraganaClick(yattyanItem);
              if ((window as any).triggerYattyanClick) {
                (window as any).triggerYattyanClick();
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16">
                <img
                  src={yattyanItem.image}
                  alt={yattyanItem.word}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="text-lg sm:text-xl font-bold text-white">
                {yattyanItem.character}
              </div>
            </div>
          </div>
        </div>
      </div>

      <HiraganaScene
        onHiraganaClick={onHiraganaClick}
        kotoItem={kotoItem}
        akariItem={akariItem}
        ayumuItem={ayumuItem}
        mionaItem={mionaItem}
        mitsukiItem={mitsukiItem}
        yattyanItem={yattyanItem}
      />
    </>
  );
};

export default HiraganaTab;
