"use client";

import { useState, useRef } from "react";
import { Volume2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HiraganaTab from "@/components/tabs/HiraganaTab";
import ColorsTab from "@/components/tabs/ColorsTab";
import ParkTab from "@/components/tabs/ParkTab";
import NumbersTab from "@/components/tabs/NumbersTab";
import InstrumentsTab from "@/components/tabs/InstrumentsTab";

interface Crayon {
  id: string;
  color: string;
  name: string;
  nameJapanese: string;
  usage: number; // 0-100, how much has been used
}

const initialCrayons: Crayon[] = [
  { id: "1", color: "#000000", name: "Black", nameJapanese: "くろ", usage: 0 },
  { id: "2", color: "#FFFFFF", name: "White", nameJapanese: "しろ", usage: 0 },
  {
    id: "3",
    color: "#8B4513",
    name: "Brown",
    nameJapanese: "ちゃいろ",
    usage: 0,
  },
  {
    id: "4",
    color: "#808080",
    name: "Gray",
    nameJapanese: "はいいろ",
    usage: 0,
  },
  {
    id: "5",
    color: "#800080",
    name: "Purple",
    nameJapanese: "むらさき",
    usage: 0,
  },
  { id: "6", color: "#FF69B4", name: "Pink", nameJapanese: "ピンク", usage: 0 },
  { id: "7", color: "#FF0000", name: "Red", nameJapanese: "あか", usage: 0 },
  {
    id: "8",
    color: "#FFA500",
    name: "Orange",
    nameJapanese: "オレンジ",
    usage: 0,
  },
  {
    id: "9",
    color: "#FFFF00",
    name: "Yellow",
    nameJapanese: "きいろ",
    usage: 0,
  },
  {
    id: "10",
    color: "#90EE90",
    name: "Light Green",
    nameJapanese: "きみどり",
    usage: 0,
  },
  {
    id: "11",
    color: "#008000",
    name: "Green",
    nameJapanese: "みどり",
    usage: 0,
  },
  {
    id: "12",
    color: "#87CEEB",
    name: "Sky Blue",
    nameJapanese: "みずいろ",
    usage: 0,
  },
  { id: "13", color: "#0000FF", name: "Blue", nameJapanese: "あお", usage: 0 },
  {
    id: "14",
    color: "#000080",
    name: "Navy",
    nameJapanese: "こんいろ",
    usage: 0,
  },
];

export default function ColorLearningApp() {
  const [crayons, setCrayons] = useState<Crayon[]>(initialCrayons);
  const [selectedCrayon, setSelectedCrayon] = useState<Crayon | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("hiragana");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // タブごとのタイトル情報
  const tabTitles = {
    hiragana: {
      title: "ひらがな",
      description: "ひらがなをタップして、ことばをおぼえよう！"
    },
    colors: {
      title: "いろ",
      description: "いろをタップして、ことばをおぼえよう！"
    },
    park: {
      title: "こうえん",
      description: "こうえんのものをタップして、ことばをおぼえよう！"
    },
    numbers: {
      title: "すうじ",
      description: "すうじをタップして、ことばをおぼえよう！"
    },
    instruments: {
      title: "がっき",
      description: "がっきをタップして、ことばをおぼえよう！"
    }
  };

  // Text-to-speech function
  const speakText = (text: string, lang = "ja-JP") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1.4;
      speechSynthesis.speak(utterance);
    }
  };

  const handleCrayonClick = (crayon: Crayon) => {
    setSelectedCrayon(crayon);
    setShowPopup(true);
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    popupTimeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 2000);
    speakText(crayon.nameJapanese);
    setCrayons((prev) =>
      prev.map((c) => {
        if (c.id === crayon.id) {
          const newUsage = c.usage + 20;
          return { ...c, usage: newUsage >= 100 ? 0 : newUsage };
        }
        return c;
      })
    );
  };

  const resetCrayons = () => {
    setCrayons((prev) => prev.map((c) => ({ ...c, usage: 0 })));
  };

  const CrayonComponent = ({ crayon }: { crayon: Crayon }) => {
    const height = 120 - crayon.usage * 0.8; // より短くなるように調整
    const tipHeight = Math.max(8, 20 - crayon.usage * 0.12);

    return (
      <div
        className="flex flex-col items-center justify-end cursor-pointer transform transition-transform hover:scale-105 active:scale-95"
        onClick={() => handleCrayonClick(crayon)}
      >
        {/* Crayon tip */}
        <div
          className="w-6 rounded-t-full border border-gray-300"
          style={{
            backgroundColor: crayon.color,
            height: `${tipHeight}px`,
            borderColor: crayon.color === "#FFFFFF" ? "#ccc" : "transparent",
          }}
        />
        {/* Crayon body */}
        <div
          className="w-8 border-l border-r border-gray-300 relative"
          style={{
            backgroundColor: "#f0f0f0",
            height: `${height}px`,
            background: `linear-gradient(to bottom, ${crayon.color} 0%, ${crayon.color} 30%, #f0f0f0 30%, #f0f0f0 100%)`,
          }}
        >
          {/* Paper wrapper lines */}
          <div className="absolute inset-0 flex flex-col justify-center space-y-1 px-1">
            <div className="h-px bg-gray-400 opacity-50"></div>
            <div className="h-px bg-gray-400 opacity-50"></div>
            <div className="h-px bg-gray-400 opacity-50"></div>
          </div>
        </div>
        {/* Crayon bottom */}
        <div className="w-8 h-2 bg-gray-300 rounded-b border border-gray-400"></div>
      </div>
    );
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleParkItemClick = (item: any) => {
    setSelectedCrayon({
      id: item.id ?? "park",
      nameJapanese: item.nameJapanese,
      name: item.name,
      color: "#4ade80",
      usage: 0,
    });
    setShowPopup(true);
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    popupTimeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 2000);
    speakText(item.nameJapanese);
  };

  const handleNumberClick = (number: any) => {
    setSelectedCrayon({
      id: number.id ?? "number",
      nameJapanese: number.nameJapanese,
      name: number.nameEnglish,
      color: number.color,
      usage: 0,
    });
    setShowPopup(true);
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    popupTimeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 2000);
    speakText(number.nameJapanese);
  };

  const handleInstrumentClick = (instrument: any) => {
    setSelectedCrayon({
      id: instrument.id ?? "instrument",
      nameJapanese: instrument.nameJapanese,
      name: instrument.name,
      color: "#9333ea",
      usage: 0,
    });
    setShowPopup(true);
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    popupTimeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 2000);
    speakText(instrument.nameJapanese);
  };

  const handleHiraganaClick = (item: any) => {
    // ひらがなクリック時はポップアップ表示なし（書き順練習ダイアログのみ）
    // 音声読み上げは hiragana-scene.tsx 内で行われるため、ここでは何もしない
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-md py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">学</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              こどもまなびアプリ
            </h1>
          </div>
          
          {/* 動的タイトル表示 */}
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-1 select-none">
              {tabTitles[activeTab as keyof typeof tabTitles]?.title || "ひらがな"}
            </h2>
            <p className="text-gray-600 text-sm select-none">
              {tabTitles[activeTab as keyof typeof tabTitles]?.description || "ひらがなをタップして、ことばをおぼえよう！"}
            </p>
          </div>
        </div>
        
        {/* タブナビゲーション */}
        <div className="mt-4 flex justify-center space-x-2">
          {Object.entries(tabTitles).map(([tabId, tabInfo]) => (
            <button
              key={tabId}
              onClick={() => handleTabClick(tabId)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tabId
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tabInfo.title}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-6 select-none">
        <Card className="bg-transparent shadow-none border-none w-full">
          {activeTab === "hiragana" && (
            <HiraganaTab onHiraganaClick={handleHiraganaClick} />
          )}
          {activeTab === "colors" && (
            <ColorsTab crayons={crayons} onCrayonClick={handleCrayonClick} />
          )}
          {activeTab === "park" && (
            <ParkTab onItemClick={handleParkItemClick} />
          )}
          {activeTab === "numbers" && (
            <NumbersTab onNumberClick={handleNumberClick} />
          )}
          {activeTab === "instruments" && (
            <InstrumentsTab onInstrumentClick={handleInstrumentClick} />
          )}
        </Card>
      </div>

      {/* Color Name Popup */}
      {showPopup && selectedCrayon && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl p-4 border-4 border-yellow-300 min-w-[340px] max-w-[90vw]">
            <div className="flex items-center space-x-6">
              <div
                className="w-20 h-20 rounded-full border-4 border-gray-300"
                style={{ backgroundColor: selectedCrayon.color }}
              ></div>
              <div className="flex flex-col items-start">
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {selectedCrayon.nameJapanese}
                </h3>
                <p className="text-lg text-gray-600">{selectedCrayon.name}</p>
                <Volume2 className="w-8 h-8 text-blue-500 animate-pulse mt-2" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
