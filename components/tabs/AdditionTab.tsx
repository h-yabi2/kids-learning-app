import React from "react";
import AdditionScene from "../addition-scene";

interface AdditionTabProps {
  onProblemClick?: (problem: any) => void;
}

const AdditionTab: React.FC<AdditionTabProps> = ({ onProblemClick }) => (
  <>
    <AdditionScene onProblemClick={onProblemClick} />
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500">
        こたえをえらんで、たしざんをおぼえよう！
      </p>
    </div>
  </>
);

export default AdditionTab;

