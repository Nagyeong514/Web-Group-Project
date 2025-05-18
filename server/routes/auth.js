// routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Expense = require('../models/Expense');
const verifyToken = require('../middlewares/authMiddleware');
const db = require('../config/db');

const router = express.Router();

// ✅ 회원가입
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, age, password } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: '이메일, 비밀번호, 이름은 필수입니다.' });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: '이미 등록된 이메일입니다.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create(name, email, phone || null, age || null, hashedPassword);

        res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// ✅ 로그인
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.status(200).json({
            message: '로그인 성공',
            token: token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// ✅ 내 정보 조회
router.get('/me', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [rows] = await db.execute(`SELECT name, email, created_at, phone, age FROM users WHERE id = ?`, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('❌ 내 정보 조회 실패:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// ✅ 회원정보 수정
router.put('/me', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, phone, age, password } = req.body;

        // 기본 쿼리 및 값
        let updateQuery = 'UPDATE users SET name = ?, phone = ?, age = ?';
        const queryParams = [name, phone || null, age || null];

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateQuery += ', password_hash = ?';
            queryParams.push(hashedPassword);
        }

        updateQuery += ' WHERE id = ?';
        queryParams.push(userId);

        const [result] = await db.execute(updateQuery, queryParams);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '수정 대상 사용자가 없습니다.' });
        }

        res.status(200).json({ message: '회원정보 수정 완료' });
    } catch (error) {
        console.error('❌ 회원정보 수정 실패:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});
router.delete('/user/delete', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [result] = await db.execute(`DELETE FROM users WHERE id = ?`, [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '삭제할 사용자를 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '회원 탈퇴 완료' });
    } catch (error) {
        console.error('❌ 회원 탈퇴 실패:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});
// ✅ 보호된 라우트 테스트
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({
        message: '비밀 정보에 접근 성공!',
        userId: req.user.userId,
    });
});

// ✅ 소비내역 등록
router.post('/expenses', verifyToken, async (req, res) => {
    try {
        // ✅ 구조 분해 + receipt_id는 선택 값
        const { category, amount, storeName, productName, purchaseDate, receipt_id = null } = req.body;

        if (!category || !amount) {
            return res.status(400).json({ message: '카테고리와 금액은 필수입니다.' });
        }

        const userId = req.user.userId;

        // ✅ create 함수에 인자 순서 맞게 전달
        await Expense.create(userId, receipt_id, category, amount, storeName, productName, purchaseDate);

        res.status(201).json({ message: '소비내역 등록 완료' });
    } catch (error) {
        console.error('❌ 소비내역 등록 실패:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// router.post('/expenses', verifyToken, async (req, res) => {
//     try {
//         const { category, amount, storeName, productName, purchaseDate } = req.body;
//         if (!category || !amount) {
//             return res.status(400).json({ message: '카테고리와 금액은 필수입니다.' });
//         }

//         const userId = req.user.userId;
//         await Expense.create(userId, category, amount, storeName, productName, purchaseDate);

//         res.status(201).json({ message: '소비내역 등록 완료' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: '서버 오류' });
//     }
// });

// ✅ 소비내역 전체 조회
router.get('/expenses', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const expenses = await Expense.getAllByUserId(userId);
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// ✅ 소비내역 삭제
router.delete('/expenses/:id', verifyToken, async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.user.userId;

        const sql = `DELETE FROM expenses WHERE id = ? AND user_id = ?`;
        const [result] = await db.execute(sql, [expenseId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '삭제할 소비내역을 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '소비내역 삭제 완료' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// ✅ 소비내역 수정
router.put('/expenses/:id', verifyToken, async (req, res) => {
    try {
        const expenseId = req.params.id;
        const { category, amount, storeName, productName, purchaseDate } = req.body;
        const userId = req.user.userId;

        const sql = `
            UPDATE expenses
            SET category = ?, amount = ?, store_name = ?, product_name = ?, purchase_date = ?
            WHERE id = ? AND user_id = ?
        `;
        const [result] = await db.execute(sql, [
            category,
            amount,
            storeName,
            productName,
            purchaseDate,
            expenseId,
            userId,
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '수정할 소비내역을 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '수정 완료' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = router;
