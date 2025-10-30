interface DividerProps {
  customClassName?: string;
}

const Divider: React.FC<DividerProps> = ({ customClassName }) => (
  <div className={`h-[2px] bg-gray-200 ${customClassName || "w-[80%]"}`}></div>
);

export default Divider;
