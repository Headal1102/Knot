const nodemailer=require("nodemailer");
const express=require('express');
const router=express.Router();
require('dotenv').config();

const randomCd=Math.random().toString(16).substring(2,8);

const transporter = nodemailer.createTransport({
  service: 'gmail', // gmail을 사용함
  auth: {
    user: process.env.NODEMAILER_USER, // 나의 (작성자) 이메일 주소
    pass: process.env.NODEMAILER_PASS // 이메일의 비밀번호
  }
});

router.post('/', (req, res)=>{
  const {userEmail}=req.body;
  const mailOptions = {
    from: process.env.NODEMAILER_USER, // 작성자
    to: userEmail, // 수신자
    subject: 'Knot 메일 인증번호', // 메일 제목
    text: `인증번호 : ${randomCd}` // 메일 내용
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ randomCd });
    }
  });
});

module.exports = router;