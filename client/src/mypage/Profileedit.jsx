// client/src/mypage/Profileedit.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './Edit.css';

export default function Profileedit({ show, handleClose }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');

    // ✅ 모달 열릴 때 사용자 정보 불러오기
    useEffect(() => {
        if (show) {
            const fetchUserInfo = async () => {
                try {
                    const res = await axios.get('/api/auth/me', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    setName(res.data.name || '');
                    setEmail(res.data.email || '');
                    setPhone(res.data.phone || '');
                    setAge(res.data.age || '');
                } catch (err) {
                    console.error('❌ 사용자 정보 불러오기 실패:', err);
                }
            };

            fetchUserInfo();
        }
    }, [show]);

    const handleSave = async () => {
        try {
            const res = await axios.put(
                '/api/auth/me',
                {
                    name,
                    phone,
                    age,
                    password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (res.status === 200) {
                alert('✅ 회원정보가 수정되었습니다.');
                handleClose(); // 모달 닫기
                window.location.reload(); // 새로고침으로 반영
            }
        } catch (err) {
            console.error('❌ 회원정보 수정 실패:', err);
            alert('회원정보 수정에 실패했습니다.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="my-modal">
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>회원정보 수정</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>이름</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="이름 입력"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>이메일 (수정 불가)</Form.Label>
                        <Form.Control type="email" value={email} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>새 비밀번호 (선택)</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="변경할 비밀번호 입력"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button className="pink-button" onClick={handleSave}>
                    저장
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
