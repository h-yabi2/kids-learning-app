"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, RotateCcw, Eye, EyeOff } from "lucide-react";
import {
  hiraganaData,
  strokeOrderData,
  type HiraganaItem,
} from "@/lib/hiragana-data";
import { speakText, preloadVoice } from "@/lib/voice";
import { hiraganaSceneTexts } from "@/lib/voice-texts";

interface HiraganaSceneProps {
  onHiraganaClick: (item: HiraganaItem) => void;
  kotoItem?: HiraganaItem;
  akariItem?: HiraganaItem;
  ayumuItem?: HiraganaItem;
  mionaItem?: HiraganaItem;
  mitsukiItem?: HiraganaItem;
  yattyanItem?: HiraganaItem;
  onKotoClick?: () => void;
}

export default function HiraganaScene({
  onHiraganaClick,
  kotoItem,
  akariItem,
  ayumuItem,
  mionaItem,
  mitsukiItem,
  yattyanItem,
  onKotoClick,
}: HiraganaSceneProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isTracing, setIsTracing] = useState(false);
  const [userStrokes, setUserStrokes] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHanamaru, setShowHanamaru] = useState(false);
  const [hasUserDrawing, setHasUserDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // アニメーションスタイル
  const animationStyles = `
  @keyframes sparkle {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .sparkle-animation {
    animation: sparkle 2s ease-in-out infinite;
  }
  
  .float-animation {
    animation: float 3s ease-in-out infinite;
  }
`;

  // スタイルを注入
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // 音声プリロード
  useEffect(() => {
    preloadVoice(hiraganaSceneTexts());
  }, []);

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

  const handleCharacterClick = useCallback(
    (item: HiraganaItem) => {
      console.log("🎬 handleCharacterClickが呼ばれました:", item);
      playClickSound(); // クリック効果音を再生
      setSelectedCharacter(item.character);
      setIsModalOpen(true);
      setUserStrokes([]);
      setShowResult(false);
      setIsCorrect(false);
      setShowHanamaru(false);
      setHasUserDrawing(false);
      speakText(item.word);
      onHiraganaClick(item);
      console.log("✅ ダイアログを開きました");
    },
    [onHiraganaClick, playClickSound]
  );

  const handleKotoClick = useCallback(() => {
    console.log("🎯 handleKotoClickが呼ばれました");
    if (kotoItem) {
      console.log("📝 kotoItem:", kotoItem);
      handleCharacterClick(kotoItem);
    } else {
      console.log("❌ kotoItemがありません");
    }
  }, [kotoItem, handleCharacterClick]);

  const handleAkariClick = useCallback(() => {
    console.log("🎯 handleAkariClickが呼ばれました");
    if (akariItem) {
      console.log("📝 akariItem:", akariItem);
      handleCharacterClick(akariItem);
    } else {
      console.log("❌ akariItemがありません");
    }
  }, [akariItem, handleCharacterClick]);

  const handleAyumuClick = useCallback(() => {
    console.log("🎯 handleAyumuClickが呼ばれました");
    if (ayumuItem) {
      console.log("📝 ayumuItem:", ayumuItem);
      handleCharacterClick(ayumuItem);
    } else {
      console.log("❌ ayumuItemがありません");
    }
  }, [ayumuItem, handleCharacterClick]);

  const handleMionaClick = useCallback(() => {
    console.log("🎯 handleMionaClickが呼ばれました");
    if (mionaItem) {
      console.log("📝 mionaItem:", mionaItem);
      handleCharacterClick(mionaItem);
    } else {
      console.log("❌ mionaItemがありません");
    }
  }, [mionaItem, handleCharacterClick]);

  const handleMitsukiClick = useCallback(() => {
    console.log("🎯 handleMitsukiClickが呼ばれました");
    if (mitsukiItem) {
      console.log("📝 mitsukiItem:", mitsukiItem);
      handleCharacterClick(mitsukiItem);
    } else {
      console.log("❌ mitsukiItemがありません");
    }
  }, [mitsukiItem, handleCharacterClick]);

  const handleYattyanClick = useCallback(() => {
    console.log("🎯 handleYattyanClickが呼ばれました");
    if (yattyanItem) {
      console.log("📝 yattyanItem:", yattyanItem);
      handleCharacterClick(yattyanItem);
    } else {
      console.log("❌ yattyanItemがありません");
    }
  }, [yattyanItem, handleCharacterClick]);

  // 外部からの友達キャラクタークリックを処理
  useEffect(() => {
    // グローバル関数としてhandleKotoClickを公開
    (window as any).triggerKotoClick = () => {
      console.log("🌐 グローバルtriggerKotoClickが呼ばれました");
      handleKotoClick();
    };

    // グローバル関数としてhandleAkariClickを公開
    (window as any).triggerAkariClick = () => {
      console.log("🌐 グローバルtriggerAkariClickが呼ばれました");
      handleAkariClick();
    };

    (window as any).triggerAyumuClick = () => {
      console.log("🌐 グローバルtriggerAyumuClickが呼ばれました");
      handleAyumuClick();
    };

    (window as any).triggerMionaClick = () => {
      console.log("🌐 グローバルtriggerMionaClickが呼ばれました");
      handleMionaClick();
    };

    (window as any).triggerMitsukiClick = () => {
      console.log("🌐 グローバルtriggerMitsukiClickが呼ばれました");
      handleMitsukiClick();
    };

    (window as any).triggerYattyanClick = () => {
      console.log("🌐 グローバルtriggerYattyanClickが呼ばれました");
      handleYattyanClick();
    };

    return () => {
      delete (window as any).triggerKotoClick;
      delete (window as any).triggerAkariClick;
      delete (window as any).triggerAyumuClick;
      delete (window as any).triggerMionaClick;
      delete (window as any).triggerMitsukiClick;
      delete (window as any).triggerYattyanClick;
    };
  }, [
    handleKotoClick,
    handleAkariClick,
    handleAyumuClick,
    handleMionaClick,
    handleMitsukiClick,
    handleYattyanClick,
  ]);

  const resetStrokes = () => {
    setUserStrokes([]);
    setShowResult(false);
    setIsCorrect(false);
    setShowHanamaru(false);
    setHasUserDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // page.tsxスタイルの判定関数
  const checkDrawing = () => {
    if (hasUserDrawing) {
      setShowHanamaru(true);

      // 花丸表示時に音声読み上げ
      const congratsText = `よくできました！`;
      // const congratsText = `よくできました！「${selectedCharacter}」が じょうずに かけましたね！`;
      speakText(congratsText);

      // キャンバスをクリアして描画をリセット
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      }
      setUserStrokes([]);
      setHasUserDrawing(false);

      setTimeout(() => {
        setShowHanamaru(false);
      }, 4000); // 4秒後に花丸を非表示
    }
  };

  const startTracing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsTracing(true);
    setHasUserDrawing(true);
    setShowResult(false); // 新しく描き始めたら結果をリセット
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x =
      ("touches" in e
        ? e.touches[0].clientX - rect.left
        : e.clientX - rect.left) * scaleX;
    const y =
      ("touches" in e
        ? e.touches[0].clientY - rect.top
        : e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";

      // 新しいストロークを開始
      setUserStrokes((prev) => [...prev, `M${x},${y}`]);
    }
  };

  const trace = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isTracing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x =
      ("touches" in e
        ? e.touches[0].clientX - rect.left
        : e.clientX - rect.left) * scaleX;
    const y =
      ("touches" in e
        ? e.touches[0].clientY - rect.top
        : e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();

      // ストローク情報を記録
      setUserStrokes((prev) => {
        const newStrokes = [...prev];
        if (newStrokes.length > 0) {
          newStrokes[newStrokes.length - 1] += ` L${x},${y}`;
        }
        return newStrokes;
      });
    }
  };

  const stopTracing = () => {
    setIsTracing(false);
  };

  // キャンバスサイズをレスポンシブに調整
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const updateCanvasSize = () => {
        const isSmallScreen = window.innerWidth < 640;
        canvas.width = isSmallScreen ? 280 : 350;
        canvas.height = isSmallScreen ? 160 : 200;
      };

      updateCanvasSize();
      window.addEventListener("resize", updateCanvasSize);

      return () => {
        window.removeEventListener("resize", updateCanvasSize);
      };
    }
  }, [selectedCharacter]);

  useEffect(() => {
    if (
      canvasRef.current &&
      selectedCharacter &&
      strokeOrderData[selectedCharacter]
    ) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 見本が表示されている場合のみガイドラインを表示
        if (showGuide) {
          // 薄いガイドラインを表示
          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);

          const strokes = strokeOrderData[selectedCharacter]?.strokes || [];

          strokes.forEach((strokeData) => {
            const path = new Path2D(strokeData.path);
            ctx.stroke(path);

            // 次の描画のためにリセット
            ctx.strokeStyle = "#e5e7eb";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
          });

          ctx.setLineDash([]);
        }
      }
    }
  }, [selectedCharacter, showGuide]);

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

  // スマートフォン向けのグループ分け
  const topGroupRows = rowsData.slice(0, 5); // あ行〜な行
  const bottomGroupRows = rowsData.slice(5); // は行〜わ行

  return (
    <div className="w-full px-1" data-hiragana-scene>
      {/* デスクトップレイアウト: 横一列表示 */}
      <div className="hidden sm:block">
        <div className="flex flex-row-reverse justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
          {rowsData.map((col, colIdx) => (
            <div
              key={colIdx}
              className="flex flex-col gap-2 sm:gap-3 md:gap-4 flex-1"
            >
              {col.map((item) => (
                <div
                  key={item.id}
                  className="relative cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => handleCharacterClick(item)}
                >
                  {/* メインブロック：ひらがな文字とアイコンを統合 */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl py-3 shadow-xl border-2 border-white/30 w-full">
                    <div className="flex items-center justify-center gap-0.5 sm:gap-1 w-full">
                      {/* ひらがな文字 */}
                      <div
                        className="aspect-square w-[40%] max-w-14 min-w-8 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border-2 sm:border-3 md:border-4 border-white flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: item.color }}
                      >
                        <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-white drop-shadow-lg select-none no-callout">
                          {item.character}
                        </div>
                      </div>

                      {/* アイコンと単語 */}
                      <div className="flex flex-col items-center gap-0.5 sm:gap-1 w-[40%]">
                        {item.image && (
                          <div className="aspect-square w-full max-w-12 min-w-6 flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.word}
                              className="w-full h-full object-cover rounded"
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

      {/* スマートフォンレイアウト: 2段構造 */}
      <div className="block sm:hidden space-y-8">
        {/* 上段: あ行〜な行 */}
        <div className="flex flex-row-reverse justify-center gap-1">
          {topGroupRows.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-2 flex-1">
              {col.map((item) => (
                <div
                  key={item.id}
                  className="relative cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => handleCharacterClick(item)}
                >
                  {/* メインブロック：ひらがな文字とアイコンを統合 */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg py-3 shadow-xl border-2 border-white/30 w-full">
                    <div className="flex items-center justify-center gap-0.5 w-full">
                      {/* ひらがな文字 */}
                      <div
                        className="aspect-square w-[40%] max-w-14 min-w-8 rounded-lg shadow-lg border-2 border-white flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: item.color }}
                      >
                        <div className="text-sm font-bold text-white drop-shadow-lg select-none no-callout">
                          {item.character}
                        </div>
                      </div>

                      {/* アイコンと単語 */}
                      <div className="flex flex-col items-center gap-0.5 w-[40%]">
                        {item.image && (
                          <div className="aspect-square w-full max-w-12 min-w-6 flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.word}
                              className="w-full h-full object-cover rounded"
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

        {/* 下段: は行〜わ行 */}
        <div className="flex flex-row-reverse justify-center gap-1 pt-4">
          {bottomGroupRows.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-2 flex-1">
              {col.map((item) => (
                <div
                  key={item.id}
                  className="relative cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => handleCharacterClick(item)}
                >
                  {/* メインブロック：ひらがな文字とアイコンを統合 */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg py-3 shadow-xl border-2 border-white/30 w-full">
                    <div className="flex items-center justify-center gap-0.5 w-full">
                      {/* ひらがな文字 */}
                      <div
                        className="aspect-square w-[40%] max-w-14 min-w-8 rounded-lg shadow-lg border-2 border-white flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: item.color }}
                      >
                        <div className="text-sm font-bold text-white drop-shadow-lg select-none no-callout">
                          {item.character}
                        </div>
                      </div>

                      {/* アイコンと単語 */}
                      <div className="flex flex-col items-center gap-0.5 w-[40%]">
                        {item.image && (
                          <div className="aspect-square w-full max-w-12 min-w-6 flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.word}
                              className="w-full h-full object-cover rounded"
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

      {/* 書き順練習モーダル */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95%] sm:max-w-[70%] h-[80%] mx-auto bg-white/90 backdrop-blur-sm select-none no-callout">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 mr-10">
            <DialogTitle className="text-lg sm:text-2xl select-none no-callout">
              「
              {showGuide
                ? selectedCharacter
                : "〇".repeat(selectedCharacter?.length || 0)}
              」の れんしゅう
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center gap-2"
              >
                {showGuide ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {showGuide ? "見本をかくす" : "見本を表示"}
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* 大きな文字表示 */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-2">
                <div className="text-5xl sm:text-8xl font-bold text-gray-800 select-none no-callout">
                  {showGuide
                    ? selectedCharacter
                    : "〇".repeat(selectedCharacter?.length || 0)}
                </div>
                {selectedCharacter && (
                  <div className="flex-shrink-0">
                    <img
                      src={
                        selectedCharacter === "やびく こと"
                          ? "/images/koto.png"
                          : selectedCharacter === "あかり"
                          ? "/images/akari.png"
                          : selectedCharacter === "あゆむ"
                          ? "/images/ayumu.png"
                          : selectedCharacter === "みおな"
                          ? "/images/miona.png"
                          : selectedCharacter === "みつき"
                          ? "/images/mitsuki.png"
                          : selectedCharacter === "やっちゃん"
                          ? "/images/yattyan.png"
                          : hiraganaData.find(
                              (item) => item.character === selectedCharacter
                            )?.image || ""
                      }
                      alt={`${selectedCharacter}のイラスト`}
                      className="w-24 h-24 sm:w-24 sm:h-24 object-contain"
                      onError={(e) => {
                        // 画像が読み込めない場合は非表示にする
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* なぞり練習エリア */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-center items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-700 select-none no-callout">
                  なぞって れんしゅう しよう！
                </span>
              </div>

              <div className="flex justify-center items-center gap-4">
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={230}
                  className="border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-crosshair block w-full max-w-[600px] h-[300px]"
                  onMouseDown={startTracing}
                  onMouseMove={trace}
                  onMouseUp={stopTracing}
                  onMouseLeave={stopTracing}
                  onTouchStart={startTracing}
                  onTouchMove={trace}
                  onTouchEnd={stopTracing}
                />

                <div className="flex flex-col justify-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={resetStrokes}
                    className="min-h-[44px] px-4 py-2"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    リセット
                  </Button>
                  <Button
                    variant="default"
                    size="default"
                    onClick={checkDrawing}
                    disabled={!hasUserDrawing}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 min-h-[44px] px-4 py-2"
                  >
                    これでOK
                  </Button>
                </div>
              </div>
            </div>

            {/* page.tsxスタイルの花丸表示 */}
            {showHanamaru && (
              <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-300 !mt-0 border-none rounded-sm">
                <div className="bg-white rounded-2xl p-4 sm:p-8 text-center shadow-2xl transform animate-in zoom-in-95 duration-500 relative overflow-hidden mx-4">
                  {/* キラキラエフェクト */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 text-yellow-400 animate-pulse">
                      ✨
                    </div>
                    <div className="absolute top-6 right-6 text-pink-400 animate-bounce delay-100">
                      ⭐
                    </div>
                    <div className="absolute bottom-8 left-8 text-blue-400 animate-pulse delay-200">
                      💫
                    </div>
                    <div className="absolute bottom-4 right-4 text-purple-400 animate-bounce delay-300">
                      ✨
                    </div>
                    <div className="absolute top-1/2 left-2 text-green-400 animate-pulse delay-150">
                      🌟
                    </div>
                    <div className="absolute top-1/2 right-2 text-red-400 animate-bounce delay-250">
                      ⭐
                    </div>
                  </div>

                  {/* メイン花丸 */}
                  <div className="relative z-10">
                    <div className="mb-2 sm:mb-4 flex justify-center">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 text-4xl sm:text-6xl animate-bounce">
                        <img
                          src="/hanamaru.svg"
                          alt="よくできました"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 animate-pulse">
                      よくできました！
                    </div>
                    {/* <div className="text-lg text-gray-600 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                      「{selectedCharacter}」が じょうずに かけましたね！
                    </div> */}

                    {/* 追加の装飾 */}
                    <div className="mt-4 flex justify-center space-x-2">
                      <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
