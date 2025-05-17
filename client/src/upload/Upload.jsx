// client/src/upload/Upload.jsx

import React, { useRef } from 'react';
import { FaCameraRetro } from 'react-icons/fa';
import './upload.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Upload() {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('token');

            // 1️⃣ 이미지 업로드
            const uploadRes = await axios.post('http://localhost:5000/api/receipts/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const { imagePath, receiptId } = uploadRes.data;
            console.log(uploadRes.data);

            // 2️⃣ OCR + GPT + DB 저장 요청
            await axios.post(
                'http://localhost:5000/api/ocr/full-process',
                {
                    imagePath: imagePath,
                    receiptId: receiptId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // 3️⃣ 완료 후 알림 → 갤러리 이동
            alert('✅ 영수증이 성공적으로 업로드 및 분석되었습니다!');
            navigate('/gallery');
        } catch (err) {
            console.error('❌ 업로드 또는 분석 실패:', err);
            alert('이미지 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <p className="text">[영수증 사진을 직접 촬영하거나, 파일을 업로드해 주세요!]</p>
            <div className="camera-icon">
                <FaCameraRetro />
            </div>

            <div className="camera-button-group">
                <button className="camera-button" onClick={openFilePicker}>
                    갤러리에서 이미지 불러오기
                </button>
                <button className="camera-button" onClick={() => navigate('/camera')}>
                    촬영하기
                </button>
                <button className="camera-button" onClick={() => navigate('/gallery')}>
                    업로드한 영수증 보기
                </button>
            </div>

            {/* 숨겨진 파일 업로드 input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
}
