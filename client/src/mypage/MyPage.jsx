//My Page.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import Profileedit from './Profileedit';
import './mypage.css';
import axios from 'axios';

export default function MyPage() {
    const [showModal, setShowModal] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [userInfo, setUserInfo] = useState(null); // ✅ 사용자 정보 상태
    const navigate = useNavigate();

    // ✅ 사용자 정보 불러오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axios.get('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUserInfo(res.data);
            } catch (err) {
                console.error('사용자 정보 조회 실패:', err);
            }
        };

        fetchUserInfo();
    }, []);

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm('정말로 회원 탈퇴하시겠습니까?');
        if (!confirmed) return;

        try {
            const res = await axios.delete('/api/auth/user/delete', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (res.status === 200) {
                alert('회원 탈퇴가 완료되었습니다.');
                localStorage.removeItem('token');
                localStorage.setItem('isLoggedIn', 'false'); // ✅ localStorage도 초기화

                window.location.href = '/'; // ✅ 전체 새로고침 + isLoggedIn false 반영됨
            }
        } catch (err) {
            console.error('회원 탈퇴 실패:', err);
            alert('회원 탈퇴에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    const handleDailyAnalysis = async () => {
        try {
            const res = await axios.get('/api/ai/daily-spending-analysis', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setAnalysisData(res.data);
        } catch (err) {
            console.error('일일 소비 분석 실패:', err);
            alert('일일 소비 분석에 실패했습니다.');
        }
    };

    const handleMonthlyAnalysis = async () => {
        try {
            const res = await axios.get('/api/ai/monthly-spending-analysis', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setAnalysisData(res.data);
        } catch (err) {
            console.error('한 달 소비 분석 실패:', err);
            alert('한 달 소비 분석에 실패했습니다.');
        }
    };

    const formatCurrency = (value) => {
        if (!value) return '0원';
        return parseInt(value).toLocaleString() + '원';
    };

    return (
        <div className="mypage-wrapper">
            <div style={{ display: 'flex', height: 'auto' }}>
                <div className="profile-container" style={{ flex: 3, backgroundColor: '#fdfbe4', padding: '20px' }}>
                    <div className="icon-container">
                        <FaUser className="user" />
                    </div>
                    <ul className="user-info">
                        <li> ✏️ 이름 : {userInfo?.name || '로딩 중...'}</li>
                        <li>📧 이메일 : {userInfo?.email || '로딩 중...'}</li>
                        <li>📆 가입날짜 : {userInfo?.created_at?.slice(0, 10) || '로딩 중...'}</li>
                    </ul>
                    <div className="button">
                        <button className="bt" onClick={() => setShowModal(true)}>
                            회원정보 수정
                        </button>
                        <button className="bt" onClick={handleDeleteAccount}>
                            회원탈퇴
                        </button>
                    </div>
                </div>

                <div style={{ flex: 8, padding: '20px' }}>
                    <div className="ai-section">
                        <p className="ai-title">🤖 지갑 걱정, AI가 덜어줄게요!</p>
                        <div className="ai-description">
                            <span className="ai-quote">"내가 뭘 이렇게 많이 썼지?" </span>
                            <span className="ai-subtext">
                                AI가 당신의 하루 또는 한 달 소비 내역을 분석해드릴게요! <br />
                                필요한 건 버튼 하나만 누르면 끝! 🔍
                            </span>
                        </div>
                    </div>

                    <br />
                    <hr />
                    <br />
                    <div className="mt-1" style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                        <div className="ai-button-group" style={{ flex: 2, padding: '20px' }}>
                            <button className="ai-button" onClick={handleDailyAnalysis}>
                                일일소비 <br /> 데이터분석🧾
                            </button>
                            <button className="ai-button" onClick={handleMonthlyAnalysis}>
                                한달소비 <br /> 데이터분석🗓️
                            </button>
                        </div>
                        <div className="ai-result" style={{ flex: 9, padding: '20px' }}>
                            {analysisData ? (
                                <p>
                                    💸 오늘 소비 총액은 {formatCurrency(analysisData.totalSpending)}입니다.
                                    <br />
                                    🛍️ 가장 많이 쓴 카테고리는 "{analysisData.mostSpentCategory}"입니다!
                                    <br />
                                    🙅 쓸데없는 지출을 줄여보는 건 어떨까요?
                                </p>
                            ) : (
                                <div className="waiting-message">
                                    <p>🔄 분석 결과를 준비 중입니다...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Profileedit show={showModal} handleClose={() => setShowModal(false)} />
        </div>
    );
}
