import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Gallery.css';
import axios from 'axios';

export default function Gallery() {
    const [receipts, setReceipts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/receipts/list', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const unique = Array.from(new Map(res.data.receipts.map((item) => [item.id, item])).values());
                setReceipts(unique);
            } catch (err) {
                console.error('이미지 목록 불러오기 실패:', err);
            }
        };

        fetchReceipts();
    }, []);

    const handleDelete = async (receiptId) => {
        const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/receipts/${receiptId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setReceipts((prev) => prev.filter((item) => item.id !== receiptId));
            alert('삭제 완료!');
        } catch (err) {
            console.error('삭제 실패:', err);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="gallery-wrapper">
            {/* 상단 제목 + 버튼 */}
            <div className="top-row">
                <h2 className="gallery-title">📂 업로드한 영수증 목록</h2>
                <div className="top-right-buttons">
                    <button className="gallery-button" onClick={() => navigate('/camera')}>
                        📷 카메라로 가기
                    </button>
                    <button className="gallery-button" onClick={() => navigate('/upload')}>
                        📤 업로드 페이지로 가기
                    </button>
                </div>
            </div>

            {receipts.length === 0 ? (
                <p className="no-image">서버에 업로드된 이미지가 없습니다.</p>
            ) : (
                <div className="image-grid">
                    {receipts.map((item) => (
                        <div key={item.id} className="image-item">
                            <img
                                src={`http://localhost:5000/${item.image_path}`}
                                alt={`receipt-${item.id}`}
                                className="receipt-image"
                                onClick={() => setSelectedImage(`http://localhost:5000/${item.image_path}`)}
                            />
                            <div className="info-box">
                                <div className="gallery-button-group">
                                    <button className="gallery-button small red" onClick={() => handleDelete(item.id)}>
                                        🧽 삭제하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 이미지 확대 모달 */}
            {selectedImage && (
                <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
                    <img
                        src={selectedImage}
                        alt="확대 이미지"
                        className="modal-image"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
