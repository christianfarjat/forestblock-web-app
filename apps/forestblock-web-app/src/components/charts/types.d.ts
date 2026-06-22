export interface GenericAreaSeries {
  dataKey: string;
  name: string;
  stroke: string;
  gradientId: string;
}

export type ChartType = "area" | "bar";

export interface GenericChartProps<T> {
  data: T[];
  series: GenericAreaSeries[];
  chartType?: ChartType;
}

export interface DonutDataItem {
  name: string;
  value: number;
  color: string;
}

interface GenericDonutChartProps {
  data: DonutDataItem[];
  innerRadius?: number;
  outerRadius?: number;
}

export interface CustomLegendProps {
  payload: Array<{
    value: string;
    payload: { value: number };
    color: string;
  }>;
}
