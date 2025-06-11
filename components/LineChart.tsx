import React from 'react';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryZoomContainer } from "victory-native";

type VisibleKeys = 'open' | 'close' | 'low' | 'high';

interface LineChartProps {
  marketData: Array<{ timestamp: string; open: number; close: number; low: number; high: number }>;
  lineConfig: Array<{ key: VisibleKeys; label: string; color: string }>;
  visible: Record<VisibleKeys, boolean>;
  zoomDomain: any;
  showAllXAxis: boolean;
  onZoomDomainChange: (domain: any) => void;
}

const axisDependentStyle = {
  tickLabels: { fontSize: 12, angle: 0, textAnchor: 'end' },
};

const axisStyle = {
  tickLabels: { fontSize: 10, angle: 0, textAnchor: 'middle' },
};

const getLineStyle = (color: string) => ({
  data: { stroke: color, strokeWidth: 2 },
});

const LineChart: React.FC<LineChartProps> = ({
  marketData,
  lineConfig,
  visible,
  zoomDomain,
  onZoomDomainChange,
}) => {
  return (
    <VictoryChart
      width={400}
      height={300}
      padding={{ top: 40, bottom: 40, left: 60, right: 30 }}
      scale={{ x: 'linear', y: 'linear' }}
      domainPadding={20}
      containerComponent={
        <VictoryZoomContainer
          zoomDimension="x"
          zoomDomain={zoomDomain}
          onZoomDomainChange={onZoomDomainChange}
          allowZoom
          allowPan
        />
      }
    >
      {lineConfig.map(l => visible[l.key] && (
        <VictoryLine
          key={l.key}
          data={marketData}
          x="x"
          y={l.key}
          style={getLineStyle(l.color)}
          interpolation="monotoneX"
        />
      ))}
      <VictoryAxis
        dependentAxis
        style={axisDependentStyle}
        tickFormat={t => `$${t}`}
      />
      <VictoryAxis
        style={axisStyle}
      />
    </VictoryChart>
  );
};

export default LineChart;
