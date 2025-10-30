import React from "react";

const MonitoringStatus: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="h-2 w-2 rounded-full bg-customYellow animate-ping"></div>
    <p className=" text-customGray animate-pulse text-[18px] font-neueMontreal font-medium">
      Monitoreando tu pago...
    </p>
  </div>
);

export default MonitoringStatus;
