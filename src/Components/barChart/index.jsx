import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as echarts from 'echarts';
import { HOST, routes } from '../../constant';
import { toast } from 'react-toastify';

const BarChart = ({ selectedYear }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedYear) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${HOST}${routes.monthly_stats}${selectedYear}`);
        if (response.data?.success && response.data?.data?.stats) {
          setStats(response.data?.data?.stats);
          toast.success(`Stats loaded for ${selectedYear}`);
        }
        else {
          setStats([]);
          toast.info(`No data available for ${selectedYear}`);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          'Failed to fetch stats. Please try again.';
        toast.error(errorMessage);
        setStats([]);
      } finally {
        setLoading(false);
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
        axisLabel: { rotate: 45 }
      },
      yAxis: {
        type: 'value'
      },
      label: {
        show: true,
        position: 'top',
        color: '#000',
        fontSize: 12
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
