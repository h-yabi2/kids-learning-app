"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, RotateCcw } from "lucide-react";
import {
  hiraganaData,
  strokeOrderData,
  type HiraganaItem,
} from "@/lib/hiragana-data";

interface HiraganaSceneProps {
  onHiraganaClick: (item: HiraganaItem) => void;
  kotoItem?: HiraganaItem;
  onKotoClick?: () => void;
}

export default function HiraganaScene({
  onHiraganaClick,
  kotoItem,
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

  // Text-to-speech function using VOICEVOX
  const speakText = useCallback(async (text: string, lang = "ja-JP") => {
    try {
      // まずVOICEVOXを試す
      const response = await fetch("/api/voicevox-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          speaker: "春歌ナナ", // 歌うような優しい声のキャラクター
        }),
      });

      if (!response.ok) {
        throw new Error(`VOICEVOX API request failed: ${response.status}`);
      }

      const data = await response.json();

      // サーバーエラーでフォールバック指示がある場合
      if (data.fallback) {
        throw new Error("Server requested fallback");
      }

      console.log("🎵 VOICEVOX Response:", {
        format: data.format,
        audioLength: data.audio?.length || 0,
        cached: data.cached || false,
        speaker: data.speaker,
      });

      // Base64音声データをデコードして再生
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
        { type: data.format }
      );

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl); // メモリリークを防ぐ
      };

      audio.onerror = () => {
        console.error("VOICEVOX audio playback failed, falling back");
        URL.revokeObjectURL(audioUrl);
        // 音声再生エラー時のフォールバック
        fallbackToGoogleTTS(text).catch(() => fallbackToWebSpeech(text, lang));
      };

      await audio.play();
      console.log(
        `✅ VOICEVOX used successfully with ${data.speaker} ${
          data.cached ? "(cached)" : "(new)"
        }`
      );
    } catch (error) {
      console.error("VOICEVOX Error:", error);
      // Google Cloud TTSにフォールバック
      try {
        await fallbackToGoogleTTS(text);
      } catch (googleError) {
        console.error("Google TTS also failed:", googleError);
        // 最終的にWeb Speech APIを使用
        fallbackToWebSpeech(text, lang);
      }
    }
  }, []);

  // Google Cloud TTSフォールバック関数
  const fallbackToGoogleTTS = useCallback(async (text: string) => {
    console.log("🔄 Falling back to Google Cloud TTS");
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        voice: "ja-JP-Neural2-C",
      }),
    });

    if (!response.ok) {
      throw new Error("Google TTS API request failed");
    }

    const data = await response.json();
    const audioBlob = new Blob(
      [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
      { type: data.format }
    );

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };

    await audio.play();
    console.log("✅ Google Cloud TTS fallback used successfully");
  }, []);

  // Web Speech APIフォールバック関数
  const fallbackToWebSpeech = useCallback((text: string, lang: string) => {
    console.log("🔄 Falling back to Web Speech API");
    if ("speechSynthesis" in window) {
      // 既存の発話をキャンセル
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.7; // 子供向けにゆっくり
      utterance.pitch = 1.3; // 少し高めの声
      utterance.volume = 0.9;

      // 日本語音声の優先選択
      const voices = speechSynthesis.getVoices();
      const japaneseVoice = voices.find(
        (voice) => voice.lang.includes("ja") && voice.localService
      );
      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      }

      speechSynthesis.speak(utterance);
      console.log("✅ Web Speech API fallback used");
    } else {
      console.error("❌ No speech synthesis available");
    }
  }, []);

  const handleCharacterClick = useCallback(
    (item: HiraganaItem) => {
      console.log("🎬 handleCharacterClickが呼ばれました:", item);
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
    [onHiraganaClick, speakText]
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

  // 外部からの「こと」クリックを処理
  useEffect(() => {
    // グローバル関数としてhandleKotoClickを公開
    (window as any).triggerKotoClick = () => {
      console.log("🌐 グローバルtriggerKotoClickが呼ばれました");
      handleKotoClick();
    };

    return () => {
      delete (window as any).triggerKotoClick;
    };
  }, [handleKotoClick]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
    setUserStrokes([]);
    setShowResult(false);
    setIsCorrect(false);
    setShowHanamaru(false);
    setHasUserDrawing(false);
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
    const x =
      "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

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
    const x =
      "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

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

        // 薄いガイドラインを表示
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        const strokes =
          selectedCharacter === "こと"
            ? kotoStrokeData.strokes
            : strokeOrderData[selectedCharacter]?.strokes || [];

        strokes.forEach((strokeData, index) => {
          const path = new Path2D(strokeData.path);
          ctx.stroke(path);

          // 書き順番号を表示
          ctx.setLineDash([]);
          ctx.fillStyle = "#ef4444";
          ctx.font = "bold 16px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // 番号の背景円を描画
          ctx.beginPath();
          ctx.arc(
            strokeData.startPoint[0],
            strokeData.startPoint[1],
            12,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.stroke();

          // 番号を描画
          ctx.fillStyle = "#ef4444";
          ctx.fillText(
            strokeData.number.toString(),
            strokeData.startPoint[0],
            strokeData.startPoint[1]
          );

          // 次の描画のためにリセット
          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
        });

        ctx.setLineDash([]);
      }
    }
  }, [selectedCharacter]);

  // 「こと」の書き順データ
  const kotoStrokeData = {
    strokes: [
      { path: "M30,30 L70,30", number: 1, startPoint: [30, 30] },
      { path: "M30,60 Q50,50 70,60", number: 2, startPoint: [30, 60] },
      { path: "M40,20 L40,80", number: 3, startPoint: [40, 20] },
      { path: "M60,30 Q70,50 60,70", number: 4, startPoint: [60, 30] },
    ],
    description: "①横線、②下の曲線、③縦線、④右の曲線の順番で書きます",
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
    <div className="w-full px-1" data-hiragana-scene>
      {/* Hiragana Grid: 各行ごとに縦並び、右から左 */}
      <div className="flex flex-row-reverse justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
        {rowsData.map((col, colIdx) => (
          <div
            key={colIdx}
            className="flex flex-col gap-2 sm:gap-3 md:gap-4 flex-1"
          >
            {col.map((item, rowIdx) => (
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
                      <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
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

      {/* 書き順練習モーダル */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[50%] mx-auto bg-white/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              「{selectedCharacter}」の れんしゅう
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 大きな文字表示 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="text-8xl font-bold text-gray-800">
                  {selectedCharacter}
                </div>
                {selectedCharacter && (
                  <div className="flex-shrink-0">
                    <img
                      src={
                        selectedCharacter === "こと"
                          ? "/images/koto.png"
                          : hiraganaData.find(
                              (item) => item.character === selectedCharacter
                            )?.image || ""
                      }
                      alt={`${selectedCharacter}のイラスト`}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        // 画像が読み込めない場合は非表示にする
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 書き順説明 */}
            {selectedCharacter &&
              ((strokeOrderData[selectedCharacter] && (
                <div className="text-center text-sm text-gray-600 mb-4">
                  {strokeOrderData[selectedCharacter].description}
                </div>
              )) ||
                (selectedCharacter === "こと" && (
                  <div className="text-center text-sm text-gray-600 mb-4">
                    {kotoStrokeData.description}
                  </div>
                )))}

            {/* なぞり練習エリア */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-center items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  なぞって れんしゅう しよう！
                </span>
              </div>

              <canvas
                ref={canvasRef}
                width={350}
                height={200}
                className="border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-crosshair mx-auto block"
                onMouseDown={startTracing}
                onMouseMove={trace}
                onMouseUp={stopTracing}
                onMouseLeave={stopTracing}
                onTouchStart={startTracing}
                onTouchMove={trace}
                onTouchEnd={stopTracing}
              />

              <div className="flex justify-center gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={resetStrokes}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  リセット
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={checkDrawing}
                  disabled={!hasUserDrawing}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                >
                  これでOK
                </Button>
              </div>
            </div>

            {/* page.tsxスタイルの花丸表示 */}
            {showHanamaru && (
              <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-300 !mt-0 border-none rounded-sm">
                <div className="bg-white rounded-2xl p-8 text-center shadow-2xl transform animate-in zoom-in-95 duration-500 relative overflow-hidden">
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
                    <div className="mb-4 flex justify-center">
                      <div className="w-24 h-24 text-6xl animate-bounce">
                        <img
                          src="/hanamaru.svg"
                          alt="よくできました"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-3 animate-pulse">
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
