import HiraganaScene from "../hiragana-scene";
import React from "react";

interface HiraganaTabProps {
  onHiraganaClick: (item: any) => void;
}

const HiraganaTab: React.FC<HiraganaTabProps> = ({ onHiraganaClick }) => (
  <>
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">ひらがな</h2>
      <p className="text-gray-600">
        ひらがなをタップして、ことばをおぼえよう！
      </p>
    </div>
    <HiraganaScene onHiraganaClick={onHiraganaClick} />
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500">
        ひらがなをタップすると、ことばがきこえるよ！
      </p>
    </div>
  </>
);

export default HiraganaTab;
