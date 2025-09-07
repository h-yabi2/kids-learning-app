import React from "react";
import NumberScene from "../number-scene";

interface NumbersTabProps {
  onNumberClick: (number: any) => void;
}

const NumbersTab: React.FC<NumbersTabProps> = ({ onNumberClick }) => (
  <>
    <NumberScene onNumberClick={onNumberClick} />
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500">
        すうじをタップすると、よみかたがきこえるよ！
      </p>
    </div>
  </>
);

export default NumbersTab;
