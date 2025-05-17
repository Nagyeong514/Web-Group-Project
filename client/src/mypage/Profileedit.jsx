// client/src/mypage/Profileedit.jsx

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './Edit.css';

export default function Profileedit({ show, handleClose }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSave = () => {
        // 저장 요청을 백엔드로 보내려면 이 부분에 axios 요청 추가
        alert('✅ 수정이 완료되었습니다!');
        handleClose(); // 저장 후 모달 닫기
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
                        <Form.Label>이메일</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="이메일 입력"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="새 비밀번호 입력"
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
