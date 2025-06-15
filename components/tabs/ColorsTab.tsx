import React from "react";

interface Crayon {
  id: string;
  color: string;
  name: string;
  nameJapanese: string;
  usage: number;
}

interface ColorsTabProps {
  crayons: Crayon[];
  onCrayonClick: (crayon: Crayon) => void;
}

const ColorsTab: React.FC<ColorsTabProps> = ({ crayons, onCrayonClick }) => {
  const CrayonComponent = ({ crayon }: { crayon: Crayon }) => {
    const height = 120 - crayon.usage * 0.8;
    const tipHeight = Math.max(8, 20 - crayon.usage * 0.12);
    return (
      <div
        className="flex flex-col items-center justify-end cursor-pointer transform transition-transform hover:scale-105 active:scale-95"
        onClick={() => onCrayonClick(crayon)}
      >
        <div
          className="w-6 rounded-t-full border border-gray-300"
          style={{
            backgroundColor: crayon.color,
            height: `${tipHeight}px`,
            borderColor: crayon.color === "#FFFFFF" ? "#ccc" : "transparent",
          }}
        />
        <div
          className="w-8 border-l border-r border-gray-300 relative"
          style={{
            backgroundColor: "#f0f0f0",
            height: `${height}px`,
            background: `linear-gradient(to bottom, ${crayon.color} 0%, ${crayon.color} 30%, #f0f0f0 30%, #f0f0f0 100%)`,
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center space-y-1 px-1">
            <div className="h-px bg-gray-400 opacity-50"></div>
            <div className="h-px bg-gray-400 opacity-50"></div>
            <div className="h-px bg-gray-400 opacity-50"></div>
          </div>
        </div>
        <div className="w-8 h-2 bg-gray-300 rounded-b border border-gray-400"></div>
      </div>
    );
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">いろ</h2>
        <p className="text-gray-600">
          クレヨンをタップして、いろのなまえをおぼえよう！
        </p>
      </div>
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl p-8 border-4 border-amber-200 shadow-inner">
        <div className="grid grid-cols-7 gap-4 justify-items-center">
          {crayons.map((crayon) => (
            <CrayonComponent key={crayon.id} crayon={crayon} />
          ))}
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          クレヨンをタップすると、いろのなまえがきこえるよ！
        </p>
      </div>
    </>
  );
};

export default ColorsTab;
