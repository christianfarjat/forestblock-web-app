/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";

interface RenderLegendProps {
  colors: string[];
  payload?: any;
}

const RenderLegend: React.FC<RenderLegendProps> = (props) => {
  const { payload = [], colors } = props;

  return (
    <div className="flex justify-start space-x-4 mb-10">
      {payload.map((entry: any, index: number) => {
        const newColor = colors[index % colors.length];

        return (
          <div
            key={`legend-item-${index}`}
            className="flex items-center space-x-1"
          >
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: newColor }}
            ></div>
            <span className="text-gray-500">
              {`Alcance ${entry.dataKey.replace("scope", "")}`}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default RenderLegend;
