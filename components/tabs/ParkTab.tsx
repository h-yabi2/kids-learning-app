import React from "react";
import ParkScene from "../park-scene";

interface ParkTabProps {
  onItemClick: (item: any) => void;
}

const ParkTab: React.FC<ParkTabProps> = ({ onItemClick }) => (
  <div className="p-8 bg-white/80 backdrop-blur-sm shadow-xl">
    <ParkScene onItemClick={onItemClick} />
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500">
        ゆうぐをタップすると、なまえがきこえるよ！
      </p>
    </div>
  </div>
);

export default ParkTab;
