"use client"

import { useState } from "react"

interface PlaygroundItem {
  id: string
  name: string
  nameJapanese: string
  x: number // パーセンテージ位置
  y: number
  width: number
  height: number
  emoji: string
}

const playgroundItems: PlaygroundItem[] = [
  { id: "slide", name: "Slide", nameJapanese: "すべりだい", x: 75, y: 45, width: 8, height: 12, emoji: "🛝" },
  { id: "swing", name: "Swing", nameJapanese: "ぶらんこ", x: 45, y: 35, width: 6, height: 8, emoji: "🪀" },
  { id: "seesaw", name: "Seesaw", nameJapanese: "シーソー", x: 25, y: 60, width: 8, height: 4, emoji: "⚖️" },
  {
    id: "jungle-gym",
    name: "Jungle Gym",
    nameJapanese: "ジャングルジム",
    x: 60,
    y: 55,
    width: 10,
    height: 10,
    emoji: "🏗️",
  },
  { id: "sandbox", name: "Sandbox", nameJapanese: "すなば", x: 20, y: 75, width: 12, height: 8, emoji: "🏖️" },
  {
    id: "basketball",
    name: "Basketball Hoop",
    nameJapanese: "バスケットゴール",
    x: 15,
    y: 45,
    width: 6,
    height: 10,
    emoji: "🏀",
  },
  { id: "pool", name: "Pool", nameJapanese: "プール", x: 40, y: 75, width: 15, height: 8, emoji: "🏊" },
  { id: "monkey-bars", name: "Monkey Bars", nameJapanese: "うんてい", x: 30, y: 25, width: 12, height: 6, emoji: "🐒" },
]

interface Child {
  id: string
  x: number
  y: number
  activity: string
  emoji: string
}

const children: Child[] = [
  { id: "child1", x: 77, y: 52, activity: "sliding", emoji: "👧" },
  { id: "child2", x: 47, y: 38, activity: "swinging", emoji: "👦" },
  { id: "child3", x: 27, y: 62, activity: "seesaw", emoji: "👧" },
  { id: "child4", x: 62, y: 58, activity: "climbing", emoji: "👦" },
  { id: "child5", x: 22, y: 78, activity: "playing in sand", emoji: "👧" },
  { id: "child6", x: 17, y: 48, activity: "playing basketball", emoji: "👦" },
  { id: "child7", x: 42, y: 77, activity: "swimming", emoji: "👧" },
  { id: "child8", x: 32, y: 28, activity: "monkey bars", emoji: "👦" },
  { id: "child9", x: 50, y: 50, activity: "running", emoji: "👧" },
  { id: "child10", x: 35, y: 40, activity: "playing ball", emoji: "👦" },
]

interface ParkSceneProps {
  onItemClick: (item: PlaygroundItem) => void
}

export default function ParkScene({ onItemClick }: ParkSceneProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const handleItemClick = (item: PlaygroundItem) => {
    setSelectedItem(item.id)
    onItemClick(item)
    setTimeout(() => setSelectedItem(null), 1000)
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-sky-200 via-green-200 to-green-300 rounded-2xl overflow-hidden border-4 border-green-300 shadow-inner">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Sky and clouds */}
        <div className="absolute top-4 left-8 text-2xl">☁️</div>
        <div className="absolute top-6 right-12 text-xl">☁️</div>
        <div className="absolute top-2 left-1/3 text-lg">☁️</div>

        {/* Sun */}
        <div className="absolute top-4 right-8 text-3xl">☀️</div>

        {/* Trees */}
        <div className="absolute bottom-8 left-4 text-4xl">🌳</div>
        <div className="absolute bottom-12 right-4 text-3xl">🌲</div>
        <div className="absolute bottom-10 left-1/4 text-3xl">🌳</div>

        {/* Flowers */}
        <div className="absolute bottom-4 left-12 text-lg">🌸</div>
        <div className="absolute bottom-6 right-16 text-lg">🌺</div>
        <div className="absolute bottom-8 left-2/3 text-lg">🌻</div>
      </div>

      {/* Children */}
      {children.map((child) => (
        <div
          key={child.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-pulse"
          style={{
            left: `${child.x}%`,
            top: `${child.y}%`,
          }}
        >
          {child.emoji}
        </div>
      ))}

      {/* Playground Items */}
      {playgroundItems.map((item) => (
        <div
          key={item.id}
          className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
            selectedItem === item.id ? "scale-125 animate-pulse" : ""
          }`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.width}%`,
            height: `${item.height}%`,
          }}
          onClick={() => handleItemClick(item)}
        >
          <div className="w-full h-full flex items-center justify-center bg-white/20 rounded-lg border-2 border-white/40 backdrop-blur-sm">
            <span className="text-2xl">{item.emoji}</span>
          </div>
          {selectedItem === item.id && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
              {item.nameJapanese}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
