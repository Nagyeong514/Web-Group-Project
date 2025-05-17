// client/src/components/Header.jsx
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // useNavigate 추가
// import axios from 'axios'; // axios 추가
import './Header.css';

export default function Header({ onLogout }) {
    const navigate = useNavigate(); // useNavigate 훅을 사용해 페이지 이동 처리

    // ✅ 서버 요청 없이 클라이언트에서만 로그아웃 처리
    const handleLogout = () => {
        localStorage.removeItem('token'); // ✅ 토큰 삭제
        alert('로그아웃이 완료되었습니다.');
        onLogout(); // ✅ 상태 변경 함수 호출
        navigate('/login', { replace: true }); // ✅ 로그인 페이지로 이동
    };

    return (
        <Navbar className="custom-navbar">
            {/* 왼쪽: 로고 + 텍스트 */}
            <div className="header-left">
                <Navbar.Brand as={Link} to="/" className="navbar-brand">
                    <img src="/images/logo3.png" alt="로고" className="navbar-logo" />
                </Navbar.Brand>
            </div>

            {/* 오른쪽: 메뉴 */}
            <Nav className="header-right">
                <Nav.Link
                    as={NavLink}
                    to="/Detail"
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                    Detail
                </Nav.Link>
                <Nav.Link
                    as={NavLink}
                    to="/report"
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                    Report
                </Nav.Link>

                <Nav.Link
                    as={NavLink}
                    to="/gallery"
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                    Gallery
                </Nav.Link>

                <Nav.Link
                    as={NavLink}
                    to="/mypage"
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                    MyPage
                </Nav.Link>

                {/* 로그아웃 처리 */}
                <Nav.Link as={NavLink} to="/" className="nav-link logout" onClick={handleLogout}>
                    Logout
                </Nav.Link>
            </Nav>
        </Navbar>
    );
}
