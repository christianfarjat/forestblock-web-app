import TabButton from "./TabButton";
import { TabType } from "./types";

const Tabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}) => {
  return (
    <div className="bg-[#E0DDDD] rounded-full p-1 mb-6 w-fit">
      <nav className="flex space-x-2" aria-label="Tabs">
        <TabButton
          label="Alcance"
          tabValue="alcance"
          activeTab={activeTab}
          onClick={setActiveTab}
        />
        <TabButton
          label="Categorías"
          tabValue="categorias"
          activeTab={activeTab}
          onClick={setActiveTab}
        />
        <TabButton
          label="Edificios"
          tabValue="edificios"
          activeTab={activeTab}
          onClick={setActiveTab}
        />
      </nav>
    </div>
  );
};

export default Tabs;
