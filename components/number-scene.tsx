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
import { numbersData, type NumberItem } from "@/lib/number-data";

interface NumberSceneProps {
  onNumberClick: (number: NumberItem) => void;
}

export default function NumberScene({ onNumberClick }: NumberSceneProps) {
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
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

  // 音声キャッシュ用のMap
  const audioCache = useRef(new Map<string, string>()).current;

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
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.1,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log("音声再生エラー:", error);
    }
  }, []);

  // Text-to-speech function
  const speakText = useCallback((text: string, lang = "ja-JP") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1.4;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const handleNumberClick = (number: NumberItem) => {
    console.log("[NumberScene] handleNumberClick", number);
    playClickSound(); // クリック効果音を再生
    setSelectedNumber(number.id);
    setIsModalOpen(true);
    setUserStrokes([]);
    setShowResult(false);
    setIsCorrect(false);
    setShowHanamaru(false);
    setHasUserDrawing(false);
    speakText(number.nameJapanese);
    onNumberClick(number);
    console.log("✅ ダイアログを開きました");
  };

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
      ctx.lineJoin = "round";
    }
  };

  const trace = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isTracing) return;
    e.preventDefault();

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
    }
  };

  const stopTracing = () => {
    setIsTracing(false);
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
        {numbersData.map((number) => (
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

      {/* 数字書き順練習モーダル */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95%] sm:max-w-[70%] h-[80%] mx-auto bg-white/90 backdrop-blur-sm select-none no-callout">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 mr-10">
            <DialogTitle className="text-lg sm:text-2xl select-none no-callout">
              「
              {showGuide
                ? selectedNumber
                : "〇".repeat(selectedNumber?.length || 0)}
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
            {/* 大きな数字表示 */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-2">
                <div className="text-5xl sm:text-8xl font-bold text-gray-800 select-none no-callout">
                  {showGuide
                    ? numbersData.find((n) => n.id === selectedNumber)?.number
                    : "〇"}
                </div>
                {selectedNumber && (
                  <div className="flex-shrink-0">
                    <div
                      className="w-24 h-24 sm:w-24 sm:h-24 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center"
                      style={{
                        backgroundColor: numbersData.find(
                          (n) => n.id === selectedNumber
                        )?.color,
                      }}
                    >
                      <div className="text-4xl font-bold text-white drop-shadow-lg">
                        {
                          numbersData.find((n) => n.id === selectedNumber)
                            ?.number
                        }
                      </div>
                    </div>
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
