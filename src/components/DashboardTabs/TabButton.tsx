import { TabButtonProps } from "./types";

const TabButton: React.FC<TabButtonProps> = ({
  label,
  tabValue,
  activeTab,
  onClick,
}) => {
  const baseClasses = "px-4 py-2 rounded-full transition-colors duration-300";
  const activeClasses = "text-forestGreen font-semibold shadow bg-white";
  const inactiveClasses = "text-gray-500 hover:text-gray-700";

  return (
    <button
      onClick={() => onClick(tabValue)}
      className={`${baseClasses} ${
        activeTab === tabValue ? activeClasses : inactiveClasses
      }`}
    >
      {label}
    </button>
  );
};

export default TabButton;
