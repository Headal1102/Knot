const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
require('dotenv').config();
const mysql = require('mysql2');
// 다이어리 생성
// router.post('/', diaryController.createDiary);
router.post(`/`,(req,res)=>{
    const { userId, DiaryTitle, DiaryText, DiaryWeather, DiaryDate} = req.body;

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const query = 'INSERT INTO diary (userId, DiaryTitle, DiaryText, DiaryWeather,DiaryDate) VALUES (?,?,?,?,?)';
    connection.execute(query, [userId,DiaryTitle,DiaryText,DiaryWeather,DiaryDate], (err, results) => {
        if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류');
        return;
    }else{
        res.status(200).send('ok');
    }; // 연결 종료
    connection.end()
});
    //유저데이터 리턴...
});
// 다이어리 삭제
// router.delete('/:id', diaryController.deleteDiary);
router.post(`/delete`,(req,res)=>{
    const { userId, DiaryCd } = req.body;

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    const query = 'Delete from Diary WHERE userId=? and DiaryCd=?;';
    connection.execute(query, [userId,DiaryCd], (err, results) => {
        if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류');
        return;
    }else{
        res.status(200).send('ok');
    }; // 연결 종료
    connection.end()
});
    //유저데이터 리턴...
});
// 모든 다이어리 조회
// router.get('/', diaryController.getAllDiaries);
router.get(`/:userId`,(req,res)=>{
    const userId=req.params.userId;
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    const query = 'SELECT * FROM diary WHERE userId=? ORDER BY DiaryDate DESC';
    connection.execute(query, [userId], (err, results) => {
        if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류');
        return;
    }else{
        res.json(results);
        // res.json(results[0]);
        // res.status(200).send('ok');
    }; // 연결 종료
    connection.end()
});
    //유저데이터 리턴...
});
//특정 다이어리 정보
router.get(`/:userId/:DiaryCd`,(req,res)=>{
    const userId=req.params.userId;
    const DiaryCd=req.params.DiaryCd;
    console.log(userId, DiaryCd);
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    const query = 'SELECT * FROM diary WHERE userId=? and DiaryCd=?;';
    connection.execute(query, [userId,DiaryCd], (err, results) => {
        if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류');
        return;
    }else{
        res.json(results[0]);
    }; // 연결 종료
    connection.end()
});
    //유저데이터 리턴...
});

router.get(`/:DiaryCd`,(req,res)=>{
    const userId=req.params.userId;
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    const query = 'SELECT * FROM diary WHERE userId=? ORDER BY DiaryDate DESC';
    connection.execute(query, [userId], (err, results) => {
        if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류');
        return;
    }else{
        res.json(results);
    }; // 연결 종료
    connection.end()
});
    //유저데이터 리턴...
});
//업데이트
router.post(`/update`,(req,res)=>{
    const { userId, DiaryTitle, DiaryText,DiaryWeather,DiaryCd } = req.body;
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    const query = 'update diary set  DiaryTitle=?, DiaryText=?, DiaryWeather=?  WHERE userId=? and DiaryCd=?';
    connection.execute(query, [ DiaryTitle, DiaryText,DiaryWeather,userId,DiaryCd], (err, results) => {
        if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류');
        return;
    }else{
        res.json(results);
    }; // 연결 종료
    connection.end()
});
    //유저데이터 리턴...
});
module.exports = router;
