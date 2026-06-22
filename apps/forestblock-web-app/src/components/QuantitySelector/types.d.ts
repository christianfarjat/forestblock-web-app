export interface QuantitySelectorProps {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
}
