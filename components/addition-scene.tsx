"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  generateRandomProblem,
  type AdditionProblem,
} from "@/lib/addition-data";
import { RotateCcw } from "lucide-react";

interface AdditionSceneProps {
  onProblemClick?: (problem: AdditionProblem) => void;
}

export default function AdditionScene({ onProblemClick }: AdditionSceneProps) {
  const [currentProblem, setCurrentProblem] = useState<AdditionProblem>(() =>
    generateRandomProblem()
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHanamaru, setShowHanamaru] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // おはじきの状態管理（各おはじきの元の位置を記録して色を維持）
  const [leftBeads, setLeftBeads] = useState<Array<"left" | "right">>([]);
  const [rightBeads, setRightBeads] = useState<Array<"left" | "right">>([]);

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

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
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

  // Text-to-speech function (最適化版)
  const speakText = useCallback(
    async (text: string, lang = "ja-JP") => {
      try {
        // キャッシュキーを作成
        const cacheKey = `${text}-ja-JP-Neural2-C`;

        // キャッシュされた音声があるかチェック
        if (audioCache.has(cacheKey)) {
          const cachedUrl = audioCache.get(cacheKey)!;
          const audio = new Audio(cachedUrl);
          await audio.play();
          console.log("☁️ キャッシュから音声を再生");
          return;
        }

        // TTS APIを呼び出し
        const startTime = performance.now();
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
          throw new Error("TTS API request failed");
        }

        const data = await response.json();
        const apiTime = performance.now() - startTime;

        // 非同期で音声データを処理
        const processStartTime = performance.now();
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
          { type: data.format }
        );

        const audioUrl = URL.createObjectURL(audioBlob);
        const processTime = performance.now() - processStartTime;

        // キャッシュに保存
        audioCache.set(cacheKey, audioUrl);

        const audio = new Audio(audioUrl);

        // 再生開始
        await audio.play();
        const totalTime = performance.now() - startTime;

        console.log("🎵 TTS パフォーマンス:", {
          apiTime: `${apiTime.toFixed(2)}ms`,
          processTime: `${processTime.toFixed(2)}ms`,
          totalTime: `${totalTime.toFixed(2)}ms`,
          cacheSize: audioCache.size,
        });
      } catch (error) {
        console.error("TTS Error:", error);
        console.log("🔄 Falling back to Web Speech API");
        // フォールバック: Web Speech APIを使用
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.rate = 0.7;
          utterance.pitch = 1.2;
          utterance.volume = 0.9;
          speechSynthesis.speak(utterance);
        }
      }
    },
    [audioCache]
  );

  // 問題を読み上げる
  useEffect(() => {
    if (currentProblem) {
      const problemText = `${currentProblem.num1}たす${currentProblem.num2}は？`;
      speakText(problemText);
      // おはじきをリセット（左側にnum1個、右側にnum2個）
      setLeftBeads(
        Array.from({ length: currentProblem.num1 }, () => "left" as const)
      );
      setRightBeads(
        Array.from({ length: currentProblem.num2 }, () => "right" as const)
      );
    }
  }, [currentProblem, speakText]);

  const handleAnswerClick = (choice: number) => {
    if (showResult) return; // 既に答えが表示されている場合は無視

    playClickSound();
    setSelectedAnswer(choice);
    setShowResult(true);
    setTotalAnswered((prev) => prev + 1);

    if (choice === currentProblem.answer) {
      setIsCorrect(true);
      setShowHanamaru(true);
      setScore((prev) => prev + 1);
      speakText(`せいかい！${currentProblem.answer}`);

      // 3秒後に次の問題へ
      setTimeout(() => {
        nextProblem();
      }, 3000);
    } else {
      setIsCorrect(false);
      speakText(`ちがいます。こたえは${currentProblem.answer}です。`);

      // 2秒後に次の問題へ
      setTimeout(() => {
        nextProblem();
      }, 2000);
    }

    if (onProblemClick) {
      onProblemClick(currentProblem);
    }
  };

  const nextProblem = () => {
    setCurrentProblem(generateRandomProblem());
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setShowHanamaru(false);
    // おはじきをリセット（useEffectで自動的にリセットされるが、念のため）
  };

  const resetGame = () => {
    setCurrentProblem(generateRandomProblem());
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setShowHanamaru(false);
    setScore(0);
    setTotalAnswered(0);
    // おはじきをリセット（useEffectで自動的にリセットされるが、念のため）
  };

  // ドットを生成する関数（視覚的な数え方のサポート）
  const generateDots = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="w-4 h-4 bg-white rounded-full border-2 border-gray-300"
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ));
  };

  // おはじきを移動する関数（左側と右側の間で移動、色を維持）
  const handleBeadMove = (from: "left" | "right", index: number) => {
    if (showResult) return; // 答えが表示されている場合は無視

    playClickSound();

    if (from === "left" && leftBeads.length > 0 && index < leftBeads.length) {
      // 左側から右側へ（元の色を維持）
      const bead = leftBeads[index];
      setLeftBeads((prev) => prev.filter((_, i) => i !== index));
      setRightBeads((prev) => [...prev, bead]);
    } else if (
      from === "right" &&
      rightBeads.length > 0 &&
      index < rightBeads.length
    ) {
      // 右側から左側へ（元の色を維持）
      const bead = rightBeads[index];
      setRightBeads((prev) => prev.filter((_, i) => i !== index));
      setLeftBeads((prev) => [...prev, bead]);
    }
  };

  // 全て移動する関数（色を維持）
  const handleMoveAll = (from: "left" | "right") => {
    if (showResult) return;

    playClickSound();

    if (from === "left" && leftBeads.length > 0) {
      // 左側の全てを右側へ移動（元の色を維持）
      setRightBeads((prev) => [...prev, ...leftBeads]);
      setLeftBeads([]);
    } else if (from === "right" && rightBeads.length > 0) {
      // 右側の全てを左側へ移動（元の色を維持）
      setLeftBeads((prev) => [...prev, ...rightBeads]);
      setRightBeads([]);
    }
  };

  return (
    <div className="w-full">
      {/* 問題表示 */}
      <div className="mb-8">
        <div className="flex bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-4 border-white">
          {/* スコア表示 */}
          {/* <div className="mb-6 text-center">
            <div className="inline-block bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              <div className="text-xs text-gray-600 mb-1">せいかいすう</div>
              <div className="text-2xl font-bold text-blue-600">
                {score} / {totalAnswered}
              </div>
            </div>
          </div> */}

          <div className="flex-1">
            <div className="flex justify-between items-center text-xl sm:text-2xl font-bold text-gray-700 mb-4">
              もんだい
              {/* リセットボタン */}
              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetGame}
                  className="min-h-[44px] px-6 py-3"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  リセット
                </Button>
              </div>
            </div>

            <div className="flex justify-center items-center mb-6">
              {/* 数値の視覚的表示 */}
              <div className="flex items-center justify-center gap-4 w-1/2">
                {/* 最初の数 */}
                <div className="relative flex flex-col items-center gap-2">
                  <div className="text-4xl sm:text-6xl font-bold text-gray-800">
                    {currentProblem.num1}
                  </div>
                  <div className="absolute top-full flex flex-wrap justify-center gap-1 w-[100px] min-h-9 mt-1">
                    {generateDots(currentProblem.num1)}
                  </div>
                </div>

                {/* プラス記号 */}
                <div className="text-4xl sm:text-6xl font-bold text-gray-800 mx-4">
                  +
                </div>

                {/* 2番目の数 */}
                <div className="relative flex flex-col items-center gap-2">
                  <div className="text-4xl sm:text-6xl font-bold text-gray-800">
                    {currentProblem.num2}
                  </div>
                  <div className="absolute top-full flex flex-wrap justify-center gap-1 w-[100px] min-h-9 mt-1">
                    {generateDots(currentProblem.num2)}
                  </div>
                </div>

                {/* イコール記号 */}
                <div className="text-4xl sm:text-6xl font-bold text-gray-800">
                  =
                </div>

                {/* 答えの表示エリア */}
                <div className="text-4xl sm:text-6xl font-bold text-gray-800 min-w-[80px]">
                  ?
                </div>
              </div>

              {/* 選択肢 */}
              <div className="grid grid-cols-2 gap-4 w-1/2">
                {currentProblem.choices.map((choice: number, index: number) => {
                  const isSelected = selectedAnswer === choice;
                  const isCorrectChoice = choice === currentProblem.answer;
                  const showCorrect = showResult && isCorrectChoice;
                  const showWrong =
                    showResult && isSelected && !isCorrectChoice;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(choice)}
                      disabled={showResult}
                      className={`
                    relative p-4 rounded-2xl text-3xl sm:text-4xl font-bold
                    transition-all duration-300 transform
                    ${
                      showResult
                        ? "cursor-not-allowed"
                        : "cursor-pointer hover:scale-105 active:scale-95"
                    }
                    ${
                      showCorrect
                        ? "bg-green-500 text-white shadow-lg ring-4 ring-green-300"
                        : showWrong
                        ? "bg-red-500 text-white shadow-lg ring-4 ring-red-300"
                        : isSelected
                        ? "bg-blue-400 text-white shadow-lg"
                        : "bg-white text-gray-800 shadow-md border-2 border-gray-200 hover:border-blue-400"
                    }
                  `}
                    >
                      {choice}
                      {showCorrect && (
                        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                          ✓
                        </div>
                      )}
                      {showWrong && (
                        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                          ✗
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* おはじきで計算 */}
            <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-gray-200">
              <div className="text-base font-bold text-gray-700 mb-4 text-center">
                おはじきでかぞえてみよう！
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* 左側エリア */}
                <div className="flex-1 w-full sm:w-auto">
                  {leftBeads.length > 0 && (
                    <button
                      onClick={() => handleMoveAll("left")}
                      disabled={showResult}
                      className={`
                        w-full mb-2 py-2 px-4 rounded-lg text-xs font-semibold
                        bg-blue-500 text-white shadow-md
                        transition-all duration-200
                        ${
                          showResult
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-blue-600 active:scale-95"
                        }
                      `}
                    >
                      ぜんぶうごかす →
                    </button>
                  )}
                  <div className="bg-blue-50 rounded-xl p-4 min-h-[100px] border-2 border-blue-200 flex flex-wrap gap-2 justify-center items-start content-start">
                    {leftBeads.map((bead, index) => (
                      <button
                        key={`left-${index}`}
                        onClick={() => handleBeadMove("left", index)}
                        disabled={showResult}
                        className={`
                          w-8 h-8 rounded-full shadow-md
                          transition-all duration-200
                          ${bead === "left" ? "bg-blue-500" : "bg-orange-500"}
                          ${
                            showResult
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer hover:scale-110 active:scale-95 hover:shadow-lg"
                          }
                        `}
                      />
                    ))}
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                      {leftBeads.length}
                    </div>
                  </div>
                </div>

                {/* 中央の矢印（双方向） */}
                <div className="flex flex-row sm:flex-col items-center gap-2">
                  <div className="text-2xl text-gray-400 rotate-90 sm:rotate-0">
                    ⇄
                  </div>
                  <div className="text-base font-bold text-gray-700">
                    うごかす
                  </div>
                </div>

                {/* 右側エリア */}
                <div className="flex-1 w-full sm:w-auto">
                  {rightBeads.length > 0 && (
                    <button
                      onClick={() => handleMoveAll("right")}
                      disabled={showResult}
                      className={`
                        w-full mb-2 py-2 px-4 rounded-lg text-xs font-semibold
                        bg-orange-500 text-white shadow-md
                        transition-all duration-200
                        ${
                          showResult
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-orange-600 active:scale-95"
                        }
                      `}
                    >
                      ← ぜんぶうごかす
                    </button>
                  )}
                  <div className="bg-orange-50 rounded-xl p-4 min-h-[100px] border-2 border-orange-200 flex flex-wrap gap-2 justify-center items-start content-start">
                    {rightBeads.map((bead, index) => (
                      <button
                        key={`right-${index}`}
                        onClick={() => handleBeadMove("right", index)}
                        disabled={showResult}
                        className={`
                          w-8 h-8 rounded-full shadow-md
                          transition-all duration-200
                          ${bead === "left" ? "bg-blue-500" : "bg-orange-500"}
                          ${
                            showResult
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer hover:scale-110 active:scale-95 hover:shadow-lg"
                          }
                        `}
                      />
                    ))}
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-3xl sm:text-4xl font-bold text-orange-600">
                      {rightBeads.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 花丸表示 */}
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
                <div className="w-16 h-16 sm:w-24 sm:h-24 text-3xl sm:text-5xl animate-bounce">
                  <img
                    src="/hanamaru.svg"
                    alt="よくできました"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 animate-pulse">
                せいかい！
              </div>
              <div className="text-base sm:text-xl text-gray-700 mb-2">
                こたえは {currentProblem.answer} です
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
  );
}
