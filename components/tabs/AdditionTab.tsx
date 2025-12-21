import React from "react";
import AdditionScene from "../addition-scene";

interface AdditionTabProps {
  onProblemClick?: (problem: any) => void;
}

const AdditionTab: React.FC<AdditionTabProps> = ({ onProblemClick }) => (
  <>
    <AdditionScene onProblemClick={onProblemClick} />
  </>
);

export default AdditionTab;
