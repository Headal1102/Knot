const express = require('express');
const mysql = require('mysql2');  // mysql 모듈 추가
const router = express.Router();
const path = require('path');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

router.post('/', (req, res) => { //json으로 정보전달
    const { userId } = req.body;  // req.body에서 userId 가져오기

    // MySQL 연결
    connection.connect((err) => {
        if (err) {
            console.error('MySQL 연결 실패:', err);
            return res.status(500).json({ error: 'Database connection failed' });
        }

        const query = 'SELECT * FROM user WHERE userId = ?';
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error('쿼리 실행 실패:', err);
                res.status(500).json({ error: 'Query execution failed' });
                console.log('데이터가 없습니다.');
            } else {
                res.json(results[0]);  // 첫 번째 결과를 JSON으로 반환
            } 
        });
        // 연결 종료
    });
});

router.post('/logout',(req,res)=>{
    req.session.destroy();
});

router.put('/modify',(req,res)=>{
    const userName=req.body.userName;
    const userMsg=req.body.userMsg;
    const userId=req.body.userId;

        // MySQL 연결
        connection.connect((err) => {
            if (err) {
                console.error('MySQL 연결 실패:', err);
                return res.status(500).json({ error: 'Database connection failed' });
            }
        })

        const query = 'update table user set userName=?,userMsg=? where userId=?;';
        connection.query(query, [userName,userMsg, userId],(err, results) => {
            if (err) {
                console.error('쿼리 실행 실패:', err);
                res.status(500).json({ error: 'Query execution failed' });
            } else {
                console.log('탈퇴하였습니다.');
            } 
        });
        connection.end();
});

router.delete('/bye',(req,res)=>{
    const { userId } = req.body.userId;  // req.body에서 userId 가져오기
    const { userPsw } = req.body.userPsw;

    // MySQL 연결
    connection.connect((err) => {
        if (err) {
            console.error('MySQL 연결 실패:', err);
            return res.status(500).json({ error: 'Database connection failed' });
        }

        const query = 'Delete from user where userId=? and userPsw=?;';
        connection.query(query, [userId, userPsw],(err, results) => {
            if (err) {
                console.error('쿼리 실행 실패:', err);
                res.status(500).json({ error: 'Query execution failed' });
            } else {
                console.log('탈퇴하였습니다.');
            } 
        });
        // 연결 종료
        connection.end();
    });
});
module.exports = router;
