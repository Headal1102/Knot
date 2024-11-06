const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const port = 8080;
const session = require('express-session');
//const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

// 미들웨어 설정
app.use(cors({
    origin: 'http://localhost:3000', // React 개발 서버 주소
    credentials: true                // 세션 쿠키 허용
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 세션 설정
app.use(session({
    secret: 'Hell5Knot',
    resave: false,
    saveUninitialized: true,
    store: new session.MemoryStore({
        checkPeriod: 24 * 60 * 60 * 1000,
    }),
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // 배포 환경에서만 secure: true
    }
}));

// 라우터 설정
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const mypageRouter = require('./routes/mypage');
const emailRouter = require('./routes/email');
const findIdPswRouter = require('./routes/find');
const userDataRouter = require('./routes/userData');
const todoRouter = require('./routes/todo');  // todoRouter에 섹션 라우트 포함

app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);
app.use('/api/mypage', mypageRouter);
app.use('/api/email', emailRouter);
app.use('/api/find', findIdPswRouter);
app.use('/api/userData', userDataRouter);
app.use('/api/todo', todoRouter);  // /api/todo 경로 아래 라우터 등록

// 로그아웃
app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('로그아웃 오류:', err);
            return res.status(500).send('서버 오류');
        }
        res.redirect('/'); // 로그아웃 후 메인 페이지로 리다이렉트
    });
});

// 상태 확인
app.get('/check-state', (req, res) => {
    res.json({
        state: req.session.state || 0,
        user: req.session.user || null
    });
    console.log({
        state: req.session.state || 0,
        user: req.session.user || null
    });
});

// 정적 파일 서빙 (라우터 설정 이후로 이동)
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
