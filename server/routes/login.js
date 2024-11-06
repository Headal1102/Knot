const express=require('express');
const router=express.Router();
const mysql = require('mysql2');
require('dotenv').config();
const path = require('path');
const bcrypt = require('bcrypt');
// require('dotenv').config();
// 로그인 페이지
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,           // MySQL 사용자
    password: process.env.DB_PASSWORD,           // MySQL 비밀번호
    database: process.env.DB_NAME        // 사용할 데이터베이스 이름
});

//로그인
router.post('/', (req, res) => {
    const userId = req.body.userId || null;
    const userPsw = req.body.userPsw || null;

    const query = 'SELECT * FROM user WHERE userId = ?';
    connection.execute(query, [userId], async(err, results) => {
    const state=0;
    if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류');
        return;
    }

    if (results.length === 0) {
        console.log('로그인 실패: 사용자 없음 또는 비밀번호 불일치');
        req.session.user=null;
        // res.sendFile(path.join(__dirname, '..','..','/client/public/index.html'))
        return;
    }

    const user = results[0];
        const SecurePsw = user.userPsw; // 데이터베이스에 저장된 해시된 비밀번호

        // bcrypt.compare()로 입력된 비밀번호와 저장된 해시 비밀번호 비교
        const passwordMatch = await bcrypt.compare(userPsw, SecurePsw);

        if (!passwordMatch) {
            return res.status(401).send('비밀번호가 일치하지 않습니다.');}

    const userName=results[0].userName;
    // Login successful
    // console.log('로그인 성공');
   
    req.session.userId=userId;
    req.session.userName=userName;
    req.session.save(()=>{
        res.json(req.session);  
    })
    // console.log(req.session);
    // res.redirect('/main');
});
});

module.exports = router; 