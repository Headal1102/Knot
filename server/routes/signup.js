const express=require('express');
const router=express.Router();
const path = require('path');
require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
//회원가입

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,           // MySQL 사용자
    password: process.env.DB_PASSWORD,           // MySQL 비밀번호
    database: process.env.DB_NAME        // 사용할 데이터베이스 이름
});

function Email(mail){
    return mail.includes('@');
}
router.post('/',async(req,res)=>{
    let date=new Date();
    const userId=req.body.userId || null;
    const userPsw=await bcrypt.hash(req.body.userPsw,10);
    const userName=req.body.userName || null;
    const userEmail=req.body.userEmail || null; //다른거 추가될 수 있음
    const userGender=req.body.userGender || null;
    const userBirth=req.body.userBirth || null;
    const userJoinTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}` || null;
    const userImgPath="."||null
    const userMsg="상태메세지 입니다."||null
    console.log(userId, userPsw, userName, userEmail, userGender, userBirth, userJoinTime, userImgPath,userMsg);
    
    const query = 'INSERT INTO `knot`.`user` (`userId`, `userName`, `userPsw`, `userEmail`, `userGender`, `userBirth`, `userJoinTime`,`userImgPath`,`userMsg`) VALUES (?,?,?,?,?,?,?,?,?);';
    connection.execute(query, [userId, userName, userPsw, userEmail, userGender,userBirth,userJoinTime,userImgPath,userMsg], (err, results) => {
    
        if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류');
        return;
    }else{
        console.log('회원가입 성공!!');
        console.log(`id: ${userId}, psw: ${userPsw}, email: ${userEmail}`);
        res.status(201).json({ message: '회원가입 성공!' });
    }
    connection.end(); // 연결 종료
});
    
});

module.exports = router; 