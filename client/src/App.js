// client/src/App.js

import './App.css';

import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Header from './components/Header';

import Detail from './ledger/Detail';
import Register from './Main/Register';
import MainPage from './Main/MainPage';
import MyPage from './mypage/MyPage';
import Login from './Main/LoginModal';
import Upload from './upload/Upload';
import ReportPage from './report/ReportPage';
import Gallery from './upload/Gallery';
import Camera from './upload/Camera';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ✅ 페이지 새로 고침 시 로그인 상태 유지
    useEffect(() => {
        const savedLoginStatus = localStorage.getItem('isLoggedIn');
        if (savedLoginStatus === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    // ✅ 로그인 상태가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn.toString());
    }, [isLoggedIn]);

    return (
        <div className="global-wrapper">
            {/* ✅ 로그인 후에만 헤더 표시 + 로그아웃 콜백 전달 */}
            {isLoggedIn && <Header onLogout={() => setIsLoggedIn(false)} />}

            <Routes>
                <Route
                    path="/"
                    element={
                        isLoggedIn ? <Navigate to="/main" /> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />
                    }
                />
                <Route path="/register" element={<Register />} />
                <Route path="/main" element={isLoggedIn ? <MainPage /> : <Navigate to="/" />} />
                <Route path="/detail" element={isLoggedIn ? <Detail /> : <Navigate to="/" />} />
                <Route path="/MyPage" element={isLoggedIn ? <MyPage /> : <Navigate to="/" />} />
                <Route path="/upload" element={isLoggedIn ? <Upload /> : <Navigate to="/" />} />
                <Route path="/report" element={isLoggedIn ? <ReportPage /> : <Navigate to="/" />} />
                <Route path="/camera" element={isLoggedIn ? <Camera /> : <Navigate to="/" />} />
                <Route path="/gallery" element={isLoggedIn ? <Gallery /> : <Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;

// import './App.css';

// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from 'react'; // useEffect 추가

// import Header from './components/Header';

// import Detail from './ledger/Detail';

// import Register from './Main/Register';
// import MainPage from './Main/MainPage';
// import MyPage from './mypage/MyPage';
// import Login from './Main/LoginModal';
// import Upload from './upload/Upload';
// import ReportPage from './report/ReportPage';
// import Gallery from './upload/Gallery';
// import Camera from './upload/Camera';

// function App() {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);

//     // 페이지 새로 고침 시 로그인 상태 유지
//     useEffect(() => {
//         const savedLoginStatus = localStorage.getItem('isLoggedIn');
//         if (savedLoginStatus === 'true') {
//             setIsLoggedIn(true);
//         }
//     }, []);

//     // 로그인 상태가 변경될 때마다 localStorage에 저장
//     useEffect(() => {
//         localStorage.setItem('isLoggedIn', isLoggedIn.toString());
//     }, [isLoggedIn]);

//     return (
//         <div className="global-wrapper">
//             {/* 로그인 후에만 헤더 항상 표시 */}
//             {isLoggedIn && <Header />}

//             <Routes>
//                 <Route
//                     path="/"
//                     element={
//                         isLoggedIn ? <Navigate to="/main" /> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />
//                     }
//                 />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/main" element={isLoggedIn ? <MainPage /> : <Navigate to="/" />} />
//                 <Route path="/detail" element={isLoggedIn ? <Detail /> : <Navigate to="/" />} />
//                 <Route path="/MyPage" element={isLoggedIn ? <MyPage /> : <Navigate to="/" />} />
//                 <Route path="/upload" element={isLoggedIn ? <Upload /> : <Navigate to="/" />} />
//                 <Route path="/report" element={isLoggedIn ? <ReportPage /> : <Navigate to="/" />} />
//                 <Route path="/camera" element={isLoggedIn ? <Camera /> : <Navigate to="/" />} />
//                 <Route path="/gallery" element={isLoggedIn ? <Gallery /> : <Navigate to="/" />} />
//                 <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//         </div>
//     );
// }

// export default App;
