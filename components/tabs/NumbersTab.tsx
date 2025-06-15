import React from "react";
import NumberScene from "../number-scene";

interface NumbersTabProps {
  onNumberClick: (number: any) => void;
}

const NumbersTab: React.FC<NumbersTabProps> = ({ onNumberClick }) => (
  <>
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">すうじ</h2>
      <p className="text-gray-600">すうじをタップして、かずをおぼえよう！</p>
    </div>
    <NumberScene onNumberClick={onNumberClick} />
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500">
        すうじをタップすると、よみかたがきこえるよ！
      </p>
    </div>
  </>
);

export default NumbersTab;
