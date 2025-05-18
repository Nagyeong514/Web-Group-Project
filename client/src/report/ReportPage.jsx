// clinet/src/report/ReportPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PieChart from './PieChart';
import LineChart from './LineChart';
import Goal from './Goal';
import './Report.css';

function ReportPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [expenses, setExpenses] = useState([]);
    const [goal, setGoal] = useState('');
    const [input, setInput] = useState('');

    // ✅ YYYY-MM-DD 형식 문자열로 변환
    const getDateString = (date) => {
        return date.toISOString().slice(0, 10);
    };

    // ✅ 현재 달의 시작일과 종료일 계산
    const getMonthRange = (date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return {
            start: getDateString(start),
            end: getDateString(end),
        };
    };

    // ✅ DB에서 해당 월 소비내역 불러오기
    useEffect(() => {
        const { start, end } = getMonthRange(currentDate);

        axios
            .get(`/api/auth/expenses/range?start=${start}&end=${end}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((res) => {
                setExpenses(res.data);
            })
            .catch((err) => {
                console.error('❌ 소비내역 불러오기 실패:', err);
            });
    }, [currentDate]);

    // ✅ 날짜, 카테고리, 금액만 추려서 전달
    const filteredExpenses = expenses.map((e) => ({
        date: e.purchase_date.slice(0, 10),
        category: e.category,
        amount: e.amount,
    }));
    console.log('📊 filteredExpenses:', filteredExpenses);

    // ✅ 달 변경 핸들러
    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    return (
        <div>
            <div className="report-header">
                <button onClick={handlePrevMonth}>◀</button>
                <span>
                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </span>
                <button onClick={handleNextMonth}>▶</button>
            </div>

            <div className="report-container">
                <div className="chart-wrapper">
                    <div className="chart-box">
                        <PieChart expenses={filteredExpenses} />
                    </div>
                    <div className="chart-box">
                        <LineChart expenses={filteredExpenses} />
                    </div>
                </div>
            </div>

            <div>
                <Goal />
            </div>
        </div>
    );
}

export default ReportPage;
