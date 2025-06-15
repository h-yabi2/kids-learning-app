"use client"

import { useState } from "react"

interface Instrument {
  id: string
  name: string
  nameJapanese: string
  x: number // パーセンテージ位置
  y: number
  width: number
  height: number
  emoji: string
  category: string
}

const instruments: Instrument[] = [
  // 鍵盤楽器
  {
    id: "piano",
    name: "Piano",
    nameJapanese: "ピアノ",
    x: 50,
    y: 70,
    width: 20,
    height: 15,
    emoji: "🎹",
    category: "keyboard",
  },

  // 弦楽器
  {
    id: "violin",
    name: "Violin",
    nameJapanese: "バイオリン",
    x: 25,
    y: 45,
    width: 6,
    height: 8,
    emoji: "🎻",
    category: "string",
  },
  {
    id: "guitar",
    name: "Guitar",
    nameJapanese: "ギター",
    x: 75,
    y: 50,
    width: 6,
    height: 10,
    emoji: "🎸",
    category: "string",
  },
  {
    id: "harp",
    name: "Harp",
    nameJapanese: "ハープ",
    x: 35,
    y: 40,
    width: 8,
    height: 12,
    emoji: "🪕",
    category: "string",
  },

  // 管楽器
  {
    id: "trumpet",
    name: "Trumpet",
    nameJapanese: "トランペット",
    x: 60,
    y: 25,
    width: 8,
    height: 6,
    emoji: "🎺",
    category: "brass",
  },
  {
    id: "trombone",
    name: "Trombone",
    nameJapanese: "トロンボーン",
    x: 70,
    y: 20,
    width: 10,
    height: 6,
    emoji: "🎺",
    category: "brass",
  },
  {
    id: "flute",
    name: "Flute",
    nameJapanese: "フルート",
    x: 45,
    y: 30,
    width: 8,
    height: 4,
    emoji: "🪈",
    category: "woodwind",
  },
  {
    id: "clarinet",
    name: "Clarinet",
    nameJapanese: "クラリネット",
    x: 20,
    y: 35,
    width: 6,
    height: 8,
    emoji: "🎷",
    category: "woodwind",
  },

  // 打楽器
  {
    id: "drums",
    name: "Drums",
    nameJapanese: "ドラム",
    x: 80,
    y: 35,
    width: 10,
    height: 10,
    emoji: "🥁",
    category: "percussion",
  },
  {
    id: "xylophone",
    name: "Xylophone",
    nameJapanese: "シロフォン",
    x: 85,
    y: 55,
    width: 10,
    height: 6,
    emoji: "🎵",
    category: "percussion",
  },
  {
    id: "triangle",
    name: "Triangle",
    nameJapanese: "トライアングル",
    x: 65,
    y: 45,
    width: 4,
    height: 4,
    emoji: "🔺",
    category: "percussion",
  },
  {
    id: "cymbals",
    name: "Cymbals",
    nameJapanese: "シンバル",
    x: 15,
    y: 25,
    width: 6,
    height: 6,
    emoji: "🥽",
    category: "percussion",
  },
  {
    id: "tambourine",
    name: "Tambourine",
    nameJapanese: "タンバリン",
    x: 55,
    y: 35,
    width: 5,
    height: 5,
    emoji: "🪘",
    category: "percussion",
  },
]

interface Child {
  id: string
  x: number
  y: number
  activity: string
  emoji: string
}

const children: Child[] = [
  { id: "conductor", x: 50, y: 55, activity: "conducting", emoji: "👨‍🎼" },
  { id: "pianist1", x: 45, y: 75, activity: "playing piano", emoji: "👧" },
  { id: "pianist2", x: 55, y: 75, activity: "playing piano", emoji: "👦" },
  { id: "violinist", x: 25, y: 50, activity: "playing violin", emoji: "👧" },
  { id: "drummer", x: 80, y: 40, activity: "playing drums", emoji: "👦" },
  { id: "audience1", x: 20, y: 80, activity: "listening", emoji: "👧" },
  { id: "audience2", x: 80, y: 80, activity: "listening", emoji: "👦" },
]

interface InstrumentsSceneProps {
  onInstrumentClick: (instrument: Instrument) => void
}

export default function InstrumentsScene({ onInstrumentClick }: InstrumentsSceneProps) {
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null)

  const handleInstrumentClick = (instrument: Instrument) => {
    setSelectedInstrument(instrument.id)
    onInstrumentClick(instrument)
    setTimeout(() => setSelectedInstrument(null), 1000)
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-purple-200 via-pink-100 to-yellow-100 rounded-2xl overflow-hidden border-4 border-purple-300 shadow-inner">
      {/* Background elements - Concert Hall */}
      <div className="absolute inset-0">
        {/* Stage area */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-3xl"></div>

        {/* Curtains */}
        <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-red-400 to-red-300 opacity-80"></div>
        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-red-400 to-red-300 opacity-80"></div>

        {/* Spotlights */}
        <div className="absolute top-4 left-1/4 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-4 right-1/4 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>

        {/* Music notes floating */}
        <div className="absolute top-8 left-12 text-2xl animate-bounce" style={{ animationDelay: "0s" }}>
          ♪
        </div>
        <div className="absolute top-12 right-20 text-xl animate-bounce" style={{ animationDelay: "0.5s" }}>
          ♫
        </div>
        <div className="absolute top-6 left-2/3 text-lg animate-bounce" style={{ animationDelay: "1s" }}>
          ♬
        </div>
        <div className="absolute top-16 left-1/3 text-xl animate-bounce" style={{ animationDelay: "1.5s" }}>
          ♩
        </div>

        {/* Audience seating area */}
        <div className="absolute bottom-4 left-8 right-8 h-8 bg-gradient-to-t from-blue-300 to-blue-200 rounded-t-lg opacity-50"></div>
      </div>

      {/* Children/Musicians */}
      {children.map((child) => (
        <div
          key={child.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl"
          style={{
            left: `${child.x}%`,
            top: `${child.y}%`,
            animation: child.activity === "conducting" ? "bounce 2s infinite" : "none",
          }}
        >
          {child.emoji}
        </div>
      ))}

      {/* Musical Instruments */}
      {instruments.map((instrument) => (
        <div
          key={instrument.id}
          className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
            selectedInstrument === instrument.id ? "scale-125 animate-pulse" : ""
          }`}
          style={{
            left: `${instrument.x}%`,
            top: `${instrument.y}%`,
            width: `${instrument.width}%`,
            height: `${instrument.height}%`,
          }}
          onClick={() => handleInstrumentClick(instrument)}
        >
          <div className="w-full h-full flex items-center justify-center bg-white/30 rounded-lg border-2 border-white/50 backdrop-blur-sm shadow-lg">
            <span className="text-2xl">{instrument.emoji}</span>
          </div>
          {selectedInstrument === instrument.id && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-2 py-1 rounded text-xs font-bold whitespace-nowrap animate-bounce">
              {instrument.nameJapanese}
            </div>
          )}
        </div>
      ))}

      {/* Piano keys (special interactive element) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex">
        {[1, 2, 3, 4, 5, 6, 7].map((key) => (
          <div
            key={key}
            className="w-6 h-12 bg-white border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleInstrumentClick(instruments.find((i) => i.id === "piano")!)}
          ></div>
        ))}
      </div>

      {/* Music stand with notes */}
      <div className="absolute" style={{ left: "50%", top: "45%", transform: "translate(-50%, -50%)" }}>
        <div className="w-16 h-12 bg-white rounded border-2 border-gray-300 flex items-center justify-center">
          <div className="text-xs">♪ ♫ ♪</div>
        </div>
        <div className="w-1 h-8 bg-gray-600 mx-auto"></div>
        <div className="w-8 h-2 bg-gray-600 mx-auto rounded"></div>
      </div>
    </div>
  )
}
