const express = require('express'); //Fast, unopinionated, minimalist web framework for Node.js.
const app = express();
const cors =require('cors');
const http=require('http').createServer(app);
const port = 8080;
const session = require('express-session'); //This is a Node.js module available through the npm registry.
const bodyParser = require('body-parser'); //parsing middleware
const path = require('path'); //This is an exact copy of the NodeJS ’path’ module published to the NPM registry.
const cookieParser=require('cookie-parser');//미들웨어, 서버에서 클라이언트에서 보낸 쿠키를 추출하고
//클라이언트에 새로운 쿠키를 저장할 수 있다.
app.use(cors({
    origin: 'http://localhost:3000', // React 개발 서버 주소
    credentials: true                // 세션 쿠키를 허용하려면 true로 설정
}));
app.use(express.json());
//미들웨어 설정
app.use(express.urlencoded({ extended: true })); //form형태 데이터 해석해줌

// 메인 페이지
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use(cookieParser());//cookie-parser미들웨어 사용


app.use(session({
    secret: 'Hell5Knot',
    resave: false,
    saveUninitialized: true, //????이거 true로하면 저장이 안됨 ㅅㅂ뭐야
    store: new session.MemoryStore({
        checkPeriod:24*60*60*1000,
    }),
    cookie: { 
        maxAge: 24* 60 * 60 * 1000, 
        httpOnly: false,
        secure:true,
    }
}));

const loginRouter=require('./routes/login');
const signupRouter=require('./routes/signup');
const mypageRouter=require('./routes/mypage');
const EmailRouter=require('./routes/email');
const FindIdPswRouter=require('./routes/find');
const userDataRouter=require('./routes/userData');
//Todo 추가
const todoRouter=require('./routes/todo');



//api 라우터
app.use('/api/login',loginRouter);
app.use('/api/signup',signupRouter);
app.use('/api/mypage',mypageRouter);
app.use('/api/email',EmailRouter);
app.use('/api/find',FindIdPswRouter);
app.use('/api/userData',userDataRouter);
//todo 추가
app.use('/api/todo',todoRouter);


//로그아웃
app.get('/api/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if (err) {
            console.error('로그아웃 오류:', err);
            res.status(500).send('서버 오류');
        } else {
            res.redirect('/');  // 로그아웃 후 메인 페이지로 리다이렉션
        }
    });
});

// app.get('/api/session',(req,res)=>{
//     console.log("세션"+JSON.stringify(req.session)); //undefined??/
//     if(req.session.userId!==null){
//         console.log('hi');
//         console.log(req.session.userId);
//         return res.json({
//             "userId":req.session.userId,
//             "userName":req.session.userName
//         })
//     }
// });

app.get('/check-state', (req, res) => {
    res.json({ state: req.session.state || 0 ,
        user:req.session.user||null
    });
    console.log({ state: req.session.state || 0,
        user:req.session.user||null
     });
});
// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
