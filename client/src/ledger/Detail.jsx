import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import { PiPencilLine } from 'react-icons/pi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import axios from 'axios';
import './detail.css';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom'; // ✅ 추가

const categories = ['음식', '쇼핑', '교통', '문화생활', '의료/기타'];

export default function Detail() {
    const location = useLocation(); // ✅ 전달받은 날짜 가져오기

    // ✅ 전달된 날짜가 있으면 사용, 없으면 오늘 날짜로
    const [selectedDate, setSelectedDate] = useState(
        location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date()
    );

    const [spendingList, setSpendingList] = useState([]);

    const formattedDate = selectedDate
        ? format(new Date(selectedDate.getTime() + 9 * 60 * 60 * 1000), 'yyyy-MM-dd')
        : '';

    useEffect(() => {
        const fetchSpending = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `http://localhost:5000/api/auth/expenses/range?start=${formattedDate}&end=${formattedDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setSpendingList(res.data);
            } catch (err) {
                console.error('❌ 소비내역 불러오기 실패:', err);
            }
        };
        fetchSpending();
    }, [formattedDate]);

    const getTotal = (list) => list.reduce((acc, cur) => acc + cur.amount, 0);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/auth/expenses/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSpendingList(spendingList.filter((item) => item.id !== id));
        } catch (err) {
            console.error('❌ 삭제 실패:', err);
        }
    };

    return (
        <div className="detail-container">
            <CalendarHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <hr></hr>
            <div className="category-grid">
                {categories.map((cat) => {
                    const catList = spendingList.filter((item) => item.category === cat);
                    const catTotal = getTotal(catList);

                    return (
                        <div className="category-box" key={cat}>
                            <div className="category-total-card">총합: {catTotal.toLocaleString()}원</div>
                            <div className="category-card">
                                <div className="category-title">{cat}</div>
                                <ul className="category-list">
                                    {catList.length === 0 ? (
                                        <li className="empty">내역 없음</li>
                                    ) : (
                                        catList.map((item) => (
                                            <li key={item.id} className="list-item">
                                                {item.store_name} : {item.amount.toLocaleString()}원
                                                <div className="action-btn">
                                                    <button className="buttons edit-btn">
                                                        <PiPencilLine />
                                                    </button>
                                                    <button
                                                        className="buttons delete-btn"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <RiDeleteBin5Line />
                                                    </button>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// import CalendarHeader from './CalendarHeader';
// import { PiPencilLine } from 'react-icons/pi';
// import { RiDeleteBin5Line } from 'react-icons/ri';

// import './detail.css';

// const categories = ['음식', '쇼핑', '교통', '문화생활', '의료/기타'];

// //  더미 데이터 (프론트에서만 테스트용)

// const dummyData = [
//     { id: 1, category: '음식', memo: '스타벅스', amount: 4500 },
//     { id: 2, category: '쇼핑', memo: '무신사 ', amount: 29000 },
//     { id: 3, category: '교통', memo: '지하철', amount: 1350 },
//     { id: 4, category: '문화생활', memo: '넷플릭스', amount: 17000 },
//     { id: 5, category: '음식', memo: '김밥천국', amount: 6500 },
//     { id: 6, category: '의료/기타', memo: '서구청보건소', amount: 3000 },
// ];

// export default function Detail() {
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [spendingList, setSpendingList] = useState(dummyData); // 여기!!

//     const getTotal = (list) => list.reduce((acc, cur) => acc + cur.amount, 0);

//     return (
//         <div className="detail-container">
//             <CalendarHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />
//             <hr></hr>
//             <div className="category-grid">
//                 {categories.map((cat) => {
//                     const catList = spendingList.filter((item) => item.category === cat);
//                     const catTotal = getTotal(catList);

//                     return (
//                         <div className="category-box" key={cat}>
//                             <div className="category-total-card">총합: {catTotal.toLocaleString()}원</div>
//                             <div className="category-card">
//                                 <div className="category-title">{cat}</div>
//                                 <ul className="category-list">
//                                     {catList.length === 0 ? (
//                                         <li className="empty">내역 없음</li>
//                                     ) : (
//                                         catList.map((item) => (
//                                             <li key={item.id} className="list-item">
//                                                 {item.memo} : {item.amount.toLocaleString()}원
//                                                 <div className="action-btn">
//                                                     <button className="buttons edit-btn">
//                                                         <PiPencilLine />
//                                                     </button>
//                                                     <button className="buttons delete-btn">
//                                                         <RiDeleteBin5Line />
//                                                     </button>
//                                                 </div>
//                                             </li>
//                                         ))
//                                     )}
//                                 </ul>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }
