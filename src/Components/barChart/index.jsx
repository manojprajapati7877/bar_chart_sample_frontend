import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as echarts from 'echarts';

const BarChart = ({ selectedYear }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (!selectedYear) return;

    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/monthly-stats/${selectedYear}`);
        if (response.data.success && response.data.data.stats) {
          setStats(response.data.data.stats);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, [selectedYear]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const months = stats.map(s => s.month_name);
    const userCounts = stats.map(s => Number(s.user_count));

    const option = {
      title: {
        text: `User Registration Stats - ${selectedYear}`,
        left: 'center'
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: { rotate: 45 } // labels tilt
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'bar',
          data: userCounts.map((count, idx) => ({
            value: count,
            itemStyle: {
              color: idx === stats.length - 1 ? '#FF5722' : '#4CAF50'
            }
          }))
        }
      ]
    };

    chartInstance.current.setOption(option);
    window.addEventListener('resize', () => chartInstance.current.resize());

    return () => window.removeEventListener('resize', () => chartInstance.current.resize());
  }, [stats, selectedYear]);

  return <div ref={chartRef} style={{ width: '100%', height: '450px', marginTop: '20px' }}></div>;
};

export default BarChart;
