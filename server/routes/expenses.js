//expenses.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const Expense = require('../models/Expense');
const pool = require('../config/db');

console.log('✅ expenses.js 라우터 정상 로딩됨');

// ✅ 날짜별 소비내역 + 카테고리별 합계 + 총합 조회
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { date } = req.query;

        console.log('🪪 사용자 ID:', userId);
        console.log('📅 요청 날짜:', date);

        if (!date) {
            return res.status(400).json({ message: '날짜가 필요합니다.' });
        }

        const start = `${date} 00:00:00`;
        const end = `${date} 23:59:59`;

        const connection = await pool.getConnection();

        // ✅ 범위 조건으로 수정
        const [totalRows] = await connection.query(
            'SELECT SUM(amount) as totalAmount FROM expenses WHERE user_id = ? AND purchase_date BETWEEN ? AND ?',
            [userId, start, end]
        );

        const [categoryRows] = await connection.query(
            'SELECT category, SUM(amount) as amount FROM expenses WHERE user_id = ? AND purchase_date BETWEEN ? AND ? GROUP BY category',
            [userId, start, end]
        );

        connection.release();

        return res.status(200).json({
            totalAmount: totalRows[0].totalAmount || 0,
            categoryAmounts: categoryRows,
        });
    } catch (error) {
        console.error('❌ 지출 조회 실패:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 🔧 소비내역 수정 (PUT /api/auth/expenses/:id)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.user.userId;
        const updates = req.body;

        const result = await Expense.update(expenseId, userId, updates);
        res.status(200).json({ message: '수정 성공', result });
    } catch (err) {
        console.error('❌ 소비내역 수정 실패:', err);
        res.status(500).json({ message: '수정 중 오류 발생' });
    }
});

// 🔧 소비내역 삭제 (DELETE /api/auth/expenses/:id)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.user.userId;

        const result = await Expense.delete(expenseId, userId);
        res.status(200).json({ message: '삭제 성공', result });
    } catch (err) {
        console.error('❌ 소비내역 삭제 실패:', err);
        res.status(500).json({ message: '삭제 중 오류 발생' });
    }
});

// 🔍 기간별 소비내역 조회 (GET /api/auth/expenses/range?start=YYYY-MM-DD&end=YYYY-MM-DD)
router.get('/range', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({ message: '시작일과 종료일이 필요합니다.' });
        }

        const rows = await Expense.getByDateRange(userId, start, end);
        res.status(200).json(rows);
    } catch (err) {
        console.error('❌ 기간별 조회 실패:', err);
        res.status(500).json({ message: '기간 조회 중 오류 발생' });
    }
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const verifyToken = require('../middlewares/authMiddleware');
// const Expense = require('../models/Expense');
// const pool = require('../config/db'); // ✅ 추가: 직접 SQL 쿼리용

// console.log('✅ expenses.js 라우터 정상 로딩됨');
// // ✅ 날짜별 소비내역 + 카테고리별 합계 + 총합 조회
// router.get('/', verifyToken, async (req, res) => {
//     try {
//         const user_id = req.user.userId;
//         const { date } = req.query;

//         if (!date) {
//             return res.status(400).json({ message: '날짜가 필요합니다.' });
//         }

//         // 1. 카테고리별 합계
//         const [categoryRows] = await pool.query(
//             `SELECT category, SUM(amount) as amount
//              FROM expenses
//              WHERE user_id = ? AND DATE(purchase_date) = ?
//              GROUP BY category`,
//             [user_id, date]
//         );

//         // 2. 총합
//         const [totalRow] = await pool.query(
//             `SELECT SUM(amount) as totalAmount
//              FROM expenses
//              WHERE user_id = ? AND DATE(purchase_date) = ?`,
//             [user_id, date]
//         );

//         res.json({
//             totalAmount: totalRow[0].totalAmount || 0,
//             categoryAmounts: categoryRows,
//         });
//     } catch (error) {
//         console.error('❌ 날짜별 소비내역 조회 오류:', error);
//         res.status(500).json({ message: '조회 실패' });
//     }
// });
// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const verifyToken = require('../middlewares/authMiddleware');
// const Expense = require('../models/Expense');

// // 소비내역 저장 API
// router.post('/', verifyToken, async (req, res) => {
//     try {
//         let { store, amount, date, category, receipt_id } = req.body;
//         const user_id = req.user.userId;

//         // ✅ 0. 디버깅: 원본 값 로그
//         console.log('🧾 원본 파라미터:', { store, amount, date, category });

//         // ✅ 1. 금액 전처리 (문자 제거 후 숫자 변환)
//         if (typeof amount === 'string') {
//             // 수정: 쉼표, 원, 공백 제거
//             const parsedAmount = parseInt(amount.replace(/[^\d]/g, ''), 10);
//             if (isNaN(parsedAmount)) {
//                 return res.status(400).json({ message: '금액 형식이 올바르지 않습니다.' });
//             }
//             amount = parsedAmount;
//         }

//         // ✅ 2. 날짜 전처리 (ISO 형식으로 변환 후 MariaDB 대응 포맷 생성)
//         if (typeof date === 'string') {
//             const parsedDate = new Date(date);
//             if (isNaN(parsedDate.getTime())) {
//                 return res.status(400).json({ message: '날짜 형식이 올바르지 않습니다.' });
//             }
//             // 수정: YYYY-MM-DD HH:mm:ss 형태로 변환
//             const pad = (n) => n.toString().padStart(2, '0');
//             const yyyy = parsedDate.getFullYear();
//             const mm = pad(parsedDate.getMonth() + 1);
//             const dd = pad(parsedDate.getDate());
//             const hh = pad(parsedDate.getHours());
//             const mi = pad(parsedDate.getMinutes());
//             const ss = pad(parsedDate.getSeconds());
//             date = `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
//         }

//         // ✅ 3. 필수 필드 유효성 검사
//         if (!store || !amount || !category || !date) {
//             console.error('❌ 필수 필드 누락 또는 변환 실패:', {
//                 store,
//                 amount,
//                 date,
//                 category,
//             });
//             return res.status(400).json({ message: '필수 항목 누락 또는 형식 오류' });
//         }

//         // ✅ 4. 디버깅: 최종 저장할 값 로그
//         console.log('🚨 저장 전 파라미터:', {
//             user_id,
//             store_name: store,
//             amount,
//             category,
//             purchase_date: date,
//             receipt_id: receipt_id || null,
//         });

//         // ✅ 5. DB 저장
//         const newExpense = await Expense.create({
//             user_id,
//             store_name: store,
//             amount,
//             category,
//             purchase_date: date,
//             receipt_id: receipt_id || null,
//         });

//         console.log('✅ 저장 성공:', newExpense);
//         res.status(201).json(newExpense);
//     } catch (error) {
//         console.error('❌ 소비내역 저장 오류:', error);
//         res.status(500).json({ message: '소비내역 저장 실패' });
//     }
// });

// // 소비내역 조회 API (날짜별 등 추후 쿼리 가능)
// router.get('/', verifyToken, async (req, res) => {
//     try {
//         const user_id = req.user.userId;
//         const expenses = await Expense.findAll({
//             where: { user_id },
//             order: [['purchase_date', 'DESC']],
//         });

//         res.status(200).json(expenses);
//     } catch (error) {
//         console.error('❌ 소비내역 조회 오류:', error);
//         res.status(500).json({ message: '소비내역 조회 실패' });
//     }
// });

// module.exports = router;
