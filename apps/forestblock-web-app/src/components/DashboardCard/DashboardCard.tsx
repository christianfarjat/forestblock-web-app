import React from "react";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  extraClassNames?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  extraClassNames = "",
}) => (
  <div
    className={`bg-white rounded-xl p-6 border-2 border-gray-200 ${extraClassNames}`}
  >
    <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
    {children}
  </div>
);

export default DashboardCard;
