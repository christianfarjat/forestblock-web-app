import { useEffect, useState } from "react";
import { CustomLegendProps } from "./types";

const CustomLegend = (props: CustomLegendProps) => {
  const { payload } = props;
  const total = payload.reduce(
    (acc: number, cur: { payload: { value: number } }) =>
      acc + cur.payload.value,
    0
  );

  const [isMobile, setIsMobile] = useState(false);
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="mt-4 w-full">
      {payload.map((entry, index) => {
        const entryName = entry.value;
        const rawValue = entry.payload.value;
        const entryColor = entry.color;
        const percentage = total > 0 ? (rawValue / total) * 100 : 0;
        const formattedValue =
          percentage.toLocaleString("es-ES", {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          }) + " %";

        return (
          <div
            key={`legend-item-${index}`}
            className="relative flex items-center justify-between mb-2 w-full"
          >
            <div className="flex items-center">
              <div
                className="w-2.5 h-2.5 rounded-full mr-2"
                style={{ backgroundColor: entryColor }}
              />
              <span
                title={!isMobile ? entryName : undefined}
                onClick={() => {
                  if (isMobile) {
                    setActiveTooltipIndex(
                      activeTooltipIndex === index ? null : index
                    );
                  }
                }}
                className={
                  isMobile ? "truncate max-w-[150px] cursor-pointer" : ""
                }
              >
                {entryName}
              </span>
            </div>
            <span className="text-gray-600">{formattedValue}</span>
            {isMobile && activeTooltipIndex === index && (
              <div
                onClick={() => setActiveTooltipIndex(null)}
                className="absolute top-full left-0 bg-white border border-gray-300 p-[5px] mt-[5px] shadow-[0_2px_8px_rgba(0,0,0,0.15)] whitespace-normal z-50"
              >
                {entryName}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CustomLegend;
