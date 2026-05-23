import KatakanaScene from "../katakana-scene";
import React, { useRef, useCallback } from "react";

interface KatakanaTabProps {
  onKatakanaClick: (item: any) => void;
}

const KatakanaTab: React.FC<KatakanaTabProps> = ({ onKatakanaClick }) => {
  // 「ヤビク コト」の特別データ
  const kotoItem = {
    id: "koto",
    character: "ヤビク コト",
    word: "ヤビク コト",
    reading: "ヤビク コト",
    color: "#FF6B9D", // ピンク系
    row: "特別",
    image: "/images/koto.png",
  };

  // 「アカリ」の特別データ
  const akariItem = {
    id: "akari",
    character: "アカリ",
    word: "アカリ",
    reading: "アカリ",
    color: "#4A90E2", // ブルー系
    row: "特別",
    image: "/images/akari.png",
  };

  // 「アユム」の特別データ
  const ayumuItem = {
    id: "ayumu",
    character: "アユム",
    word: "アユム",
    reading: "アユム",
    color: "#FF6B9D", // ピンク系
    row: "特別",
    image: "/images/ayumu.png",
  };

  // 「ミオナ」の特別データ
  const mionaItem = {
    id: "miona",
    character: "ミオナ",
    word: "ミオナ",
    reading: "ミオナ",
    color: "#9C27B0", // パープル系
    row: "特別",
    image: "/images/miona.png",
  };

  // 「ミツキ」の特別データ
  const mitsukiItem = {
    id: "mitsuki",
    character: "ミツキ",
    word: "ミツキ",
    reading: "ミツキ",
    color: "#FF9800", // オレンジ系
    row: "特別",
    image: "/images/mitsuki.png",
  };

  // 「ヤッチャン」の特別データ
  const yattyanItem = {
    id: "yattyan",
    character: "ヤッチャン",
    word: "ヤッチャン",
    reading: "ヤッチャン",
    color: "#4CAF50", // グリーン系
    row: "特別",
    image: "/images/yattyan.png",
  };

  const katakanaSceneRef = useRef<any>(null);

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
        <div className="flex gap-4 justify-start items-center overflow-x-auto pb-4 scrollbar-hide">
          {/* 「ヤビク コト」の表示 */}
          <div
            className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[120px]"
            onClick={() => {
              console.log("🔵 「ヤビク コト」がクリックされました");
              playClickSound();
              onKatakanaClick(kotoItem);
              if ((window as any).triggerKatakanaKotoClick) {
                (window as any).triggerKatakanaKotoClick();
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

          {/* 「アカリ」の表示 */}
          <div
            className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[120px]"
            onClick={() => {
              console.log("🔵 「アカリ」がクリックされました");
              playClickSound();
              onKatakanaClick(akariItem);
              if ((window as any).triggerKatakanaAkariClick) {
                (window as any).triggerKatakanaAkariClick();
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

          {/* 「アユム」の表示 */}
          <div
            className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[120px]"
            onClick={() => {
              console.log("🔵 「アユム」がクリックされました");
              playClickSound();
              onKatakanaClick(ayumuItem);
              if ((window as any).triggerKatakanaAyumuClick) {
                (window as any).triggerKatakanaAyumuClick();
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

          {/* 「ミオナ」の表示 */}
          <div
            className="bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[120px]"
            onClick={() => {
              console.log("🔵 「ミオナ」がクリックされました");
              playClickSound();
              onKatakanaClick(mionaItem);
              if ((window as any).triggerKatakanaMionaClick) {
                (window as any).triggerKatakanaMionaClick();
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

          {/* 「ミツキ」の表示 */}
          <div
            className="bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[120px]"
            onClick={() => {
              console.log("🔵 「ミツキ」がクリックされました");
              playClickSound();
              onKatakanaClick(mitsukiItem);
              if ((window as any).triggerKatakanaMitsukiClick) {
                (window as any).triggerKatakanaMitsukiClick();
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

          {/* 「ヤッチャン」の表示 */}
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-3 sm:p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[120px]"
            onClick={() => {
              console.log("🔵 「ヤッチャン」がクリックされました");
              playClickSound();
              onKatakanaClick(yattyanItem);
              if ((window as any).triggerKatakanaYattyanClick) {
                (window as any).triggerKatakanaYattyanClick();
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

      <KatakanaScene
        onKatakanaClick={onKatakanaClick}
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

export default KatakanaTab;
