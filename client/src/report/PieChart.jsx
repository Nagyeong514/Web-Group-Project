// clinet/src/report/PieChart.jsx
// clinet/src/report/PieChart.jsx

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ expenses }) {
    const categoryMap = {};
    expenses.forEach((item) => {
        categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
    });

    const labels = Object.keys(categoryMap);
    const values = Object.values(categoryMap);
    const total = values.reduce((acc, val) => acc + val, 0);

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: values,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const percent = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${percent}%`;
                    },
                },
            },
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <div style={{ width: '400px', margin: 'auto' }}>
            <h3 style={{ textAlign: 'center' }}>카테고리별 지출 비율</h3>
            <Pie data={chartData} options={options} />
        </div>
    );
}

export default PieChart;
