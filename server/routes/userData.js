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
        return res.status(500).json({ error: '서버 오류' });
    }
    /*if (results.length > 0) {
        res.json(results[0]); // 결과가 있을 경우 첫 번째 레코드를 JSON으로 반환
    } */
    else {
        res.json({}); // 결과가 없을 경우 빈 JSON 객체 반환
    }
    connection.end()
});
    //유저데이터 리턴...
});

module.exports = router; 