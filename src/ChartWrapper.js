import React, { useCallback, useState, useEffect } from 'react';
import D3Chart from './D3Chart';

function ChartWrapper({ gender }) {
  const [chart, setChart] = useState(null);
  const chartRef = useCallback(element => {
    if (element !== null) {
      setChart(new D3Chart(element));
    }
  }, []);

  useEffect(() => {
    if (chart !== null) {
      chart.update(gender);
    }
  }, [gender]);

  return <div ref={chartRef} />;
}

export default ChartWrapper;
