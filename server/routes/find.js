const express=require('express');
const router=express.Router();
const path = require('path');
require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,           // MySQL 사용자
    password: process.env.DB_PASSWORD,           // MySQL 비밀번호
    database: process.env.DB_NAME        // 사용할 데이터베이스 이름
});

router.post('/id',async(req,res)=>{
    let userEmail=req.body.userEmail;
    //인증해서 이메일 인증되면 아이디 알려주기

    const query = 'SELECT userId FROM user WHERE userEmail= ?;';
    connection.execute(query, [userEmail], (err, results) => {
        if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류');
        return;
    }else{
        res.json(results[0]);
        // res.status(200).send('ok');
    }; // 연결 종료
    connection.end()
});



});

router.post('/psw',async(req,res)=>{
    let userId=req.body.userId;
    let userEmail=req.body.userEmail;

    const query = 'SELECT userId,userPsw FROM user WHERE userId= ? and userEmail=?;';
    connection.execute(query, [userId, userEmail], (err, results) => {
        if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류');
        return;
    }else{
        res.json(results[0]);
        // res.status(200).send('ok');

        // console.log('회원 ID');
        // console.log(`id: ${userId}`);
        // res.status(201).json({ message: '회원가입 성공!' });
    }; // 연결 종료
    connection.end()
});
});

router.put('/psw/modify',async(req,res)=>{
    let userId=req.body.userId;
    let userEmail=req.body.userEmail;
    const salt = await bcrypt.genSalt(10);
    const newUserPsw=await bcrypt.hash(req.body.userPsw,salt);

    const query=`update user set userPsw=? where userId=? and userEmail=?;`;
    connection.execute(query, [newUserPsw, userId, userEmail], (err, results) => {
        if (err) {
        return res.status(500).send('서버 오류');
    }else{
        return res.status(200).send('ok');
    };
    connection.end()
});
});


module.exports = router; 