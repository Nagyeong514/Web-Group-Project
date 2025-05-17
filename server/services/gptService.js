// /server/services/gptService.js

const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function askGptToClassify(text) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `
다음 텍스트에서 다음 항목을 추출해서 JSON 형식으로 응답하세요:
- store (가게명)
- amount (총액)
- date (결제날짜)
- category (카테고리)

❗ category는 아래 목록 중 하나로만 지정해야 합니다:
- 음식
- 쇼핑
- 교통
- 문화생활
- 의료/기타

📌 응답은 아래 예시처럼 JSON 한 줄로만 작성해주세요.
예시:
{"store": "스타벅스", "amount": "5,000원", "date": "2024-05-10 14:33", "category": "음식"}
                    `.trim(),
                },
                {
                    role: 'user',
                    content: text,
                },
            ],
        });

        const raw = response.choices[0].message.content;

        // ✅ 1. JSON 파싱
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (err) {
            console.error('❌ GPT 응답이 유효한 JSON이 아님:', raw);
            throw new Error('GPT 응답 JSON 파싱 실패');
        }

        // ✅ 2. 필수 필드 유효성 검사
        const { store, amount, date, category } = parsed;
        if (!store || !amount || !date || !category) {
            throw new Error('GPT 응답 필드 누락');
        }

        // ✅ 3. amount 전처리
        const cleanedAmount = typeof amount === 'string' ? parseInt(amount.replace(/[^\d]/g, ''), 10) : amount;
        if (isNaN(cleanedAmount)) {
            throw new Error('금액 형식 오류');
        }

        // ✅ 4. date 전처리 (MariaDB 대응 포맷)
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('날짜 형식 오류');
        }
        const pad = (n) => n.toString().padStart(2, '0');
        const yyyy = parsedDate.getFullYear();
        const mm = pad(parsedDate.getMonth() + 1);
        const dd = pad(parsedDate.getDate());
        const hh = pad(parsedDate.getHours());
        const mi = pad(parsedDate.getMinutes());
        const ss = pad(parsedDate.getSeconds());
        const formattedDate = `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;

        // ✅ 5. 최종 정제된 데이터 반환
        return {
            store,
            amount: cleanedAmount,
            date: formattedDate,
            category,
        };
    } catch (error) {
        console.error('❌ GPT 처리 오류:', error.message);
        throw error;
    }
}

module.exports = { askGptToClassify };
