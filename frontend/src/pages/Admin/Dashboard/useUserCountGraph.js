import { useEffect, useState } from "react";
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useUserCountGraph = () => {
    const periods = [
        { label: "Last 7 Days", value: "7d" },
        { label: "Last 15 Days", value: "15d" },
        { label: "Last 1 Month", value: "1m" },
        { label: "Last 3 Months", value: "3m" },
        { label: "Last 6 Months", value: "6m" },
        { label: "Last 1 Year", value: "1y" },
        { label: "Last 5 Years", value: "5y" }
    ];

    // Color configuration matching the dashboard
    const CHART_COLORS = {
        primary: {
            line: 'rgb(99, 102, 241)', // indigo-500
            fill: 'rgba(99, 102, 241, 0.1)',
            point: 'rgb(79, 70, 229)' // indigo-600
        },
        gradient: {
            start: 'rgba(99, 102, 241, 0.2)',
            end: 'rgba(99, 102, 241, 0.01)'
        }
    };
    const [period, setPeriod] = useState('1m');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchUserCounts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${BASE_URL}admin/dashboard/user-counts?period=${period}`
                );

                const data = response?.data?.data?.data || [];

                if (!data.length) {
                    setChartData(null);
                    return;
                }
                const labels = data.map((item) => item.period_name);
                const counts = data.map((item) => Number(item.user_count));
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'User Count',
                            data: counts,
                            borderColor: CHART_COLORS.primary.line,
                            backgroundColor: (context) => {
                                const ctx = context.chart.ctx;
                                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                                gradient.addColorStop(0, CHART_COLORS.gradient.start);
                                gradient.addColorStop(1, CHART_COLORS.gradient.end);
                                return gradient;
                            },
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: CHART_COLORS.primary.point,
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            borderWidth: 3
                        },
                    ],
                    metadata: {
                        totalUsers: counts.reduce((sum, currentUsers) => sum + currentUsers, 0),
                        periodLabel: periods.find(p => p.value === period)?.label || period
                    }
                });
            } catch (err) {
                console.error("Failed to fetch user counts:", err);
                setError(err.message || "Failed to load user data");
                setChartData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserCounts();
    }, [period]);
    return { periods, CHART_COLORS, period, chartData, loading, error, setPeriod, setChartData, setLoading, setError }
};
export default useUserCountGraph;