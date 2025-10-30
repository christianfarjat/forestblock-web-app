import React from "react";
import Button from "@/components/Button/Button";

type ActionButtonsProps = {
  onMyRetirements: () => void;
  onRetireMore: () => void;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onMyRetirements,
  onRetireMore,
}) => {
  return (
    <div className="flex flex-col xl:flex-row gap-4">
      <Button
        text="Mis retiros"
        onClick={onMyRetirements}
        variant="secondary"
      />
      <Button text="Retirar más" onClick={onRetireMore} variant="primary" />
    </div>
  );
};

export default ActionButtons;
