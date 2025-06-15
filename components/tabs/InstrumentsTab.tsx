import React from "react";
import InstrumentsScene from "../instruments-scene";

interface InstrumentsTabProps {
  onInstrumentClick: (instrument: any) => void;
}

const InstrumentsTab: React.FC<InstrumentsTabProps> = ({
  onInstrumentClick,
}) => (
  <>
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">がっき</h2>
      <p className="text-gray-600">がっきをタップして、なまえをおぼえよう！</p>
    </div>
    <InstrumentsScene onInstrumentClick={onInstrumentClick} />
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500">
        がっきをタップすると、なまえがきこえるよ！
      </p>
    </div>
  </>
);

export default InstrumentsTab;
