# WEB 똑똑한 가계부 프로젝트

## 🧑‍🤝‍🧑 팀원 역할

### 민정님
- 캘린더 프론트 수정
- 전체 디자인

### 진희님
- 이동 경로 수정
- 뒤로가기 버튼 추가
- 가계부 수정 모달 프론트 추가

### 현수님
#### 마이페이지
- 이름, 이메일, 가입날짜 표시
- 회원정보 수정 / 회원탈퇴 기능

#### 리포트 페이지
- 화면 출력 구성
- 그래프 시각화 구현

### 안나경
- **AI의 한마디 대신 AI 챗봇 구현 예정**
- 월요일 저녁부터 개발 착수

---

## ⚠️ 주의 사항

- **DB_PORT는 `3307` 사용 중입니다!**  
  → 처음 설정 시 `.env` 파일에서 포트 변경 필요  
  → 기본값(`3306`)을 사용하실 경우 `.env`에서 직접 수정하세요.

- `.gitignore`에 정의된 파일은 git에 업로드되지 않습니다.

- **Google Vision API 키 & OpenAI API 키 없으면 OCR 작동 안 합니다!**  
  → 오류가 아닌 정상 현상입니다.

---

## 🔐 .env 파일 구조 예시

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_DATABASE=smart_ledger
DB_PORT=3307
JWT_SECRET=아무거나_복잡한_문자열
OPENAI_API_KEY=복잡한_문자열
```

---

## 📦 프론트엔드 설치 모듈

- 1️⃣ npm install react-day-picker@8.0.0 --legacy-peer-deps

- 2️⃣ npm install react@18 react-dom@18

---



