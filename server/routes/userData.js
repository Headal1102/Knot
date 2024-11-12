const express=require('express');
const router=express.Router();
const mysql = require('mysql2');
require('dotenv').config();

router.get(`/:userId`,(req,res)=>{
    const userId=req.params.userId;

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const query = 'SELECT * FROM user WHERE userId=?;';
    connection.execute(query, [userId], (err, results) => {
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
    //유저데이터 리턴...
});

router.get(`/findid/:userEmail`,(req,res)=>{
    const userEmail=req.params.userEmail;

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const query = 'SELECT * FROM user WHERE userEmail=?;';
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
    //유저데이터 리턴...
});

module.exports = router; 