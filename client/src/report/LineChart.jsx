// clinet/src/report/jsxLineChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function LineChart({ expenses }) {
    const dateMap = {};

    expenses.forEach((item) => {
        const dateStr = item.date; // ✅ ReportPage에서 이미 가공된 date 필드 사용
        if (dateStr) {
            dateMap[dateStr] = (dateMap[dateStr] || 0) + item.amount;
        }
    });

    const labels = Object.keys(dateMap).sort();
    const data = labels.map((date) => dateMap[date]);

    const chartData = {
        labels,
        datasets: [
            {
                label: '일별 지출 금액',
                data,
                borderColor: '#FF8800',
                backgroundColor: '#FFBB33',
                tension: 0.3,
                fill: false,
            },
        ],
    };

    return (
        <div style={{ width: '600px', margin: 'auto', marginTop: '40px' }}>
            <h3 style={{ textAlign: 'center' }}>일별 지출 추이</h3>
            <Line data={chartData} />
        </div>
    );
}

export default LineChart;
