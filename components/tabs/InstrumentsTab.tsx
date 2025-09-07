import React from "react";
import InstrumentsScene from "../instruments-scene";

interface InstrumentsTabProps {
  onInstrumentClick: (instrument: any) => void;
}

const InstrumentsTab: React.FC<InstrumentsTabProps> = ({
  onInstrumentClick,
}) => (
  <>
    <InstrumentsScene onInstrumentClick={onInstrumentClick} />
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500">
        がっきをタップすると、なまえがきこえるよ！
      </p>
    </div>
  </>
);

export default InstrumentsTab;
