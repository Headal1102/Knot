import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FindFW.css';

function FindFW() {

  const navigate = useNavigate(); 

  const handleTextClick = () => {
    navigate('/Login'); 
  };
  const FindId = () => {
    navigate('/FindId'); 
  };
  const [userId, setuserId] = useState('');
  const [userEmail, setuserEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); // 인증코드 상태

  // 이메일 인증 요청 함수
  const handleEmailVerification = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationCode(data.randomCd);
        alert('이메일 인증 요청이 전송되었습니다. 받은 인증 코드를 입력하세요.');
      } else {
        alert('이메일 인증 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('이메일 인증 요청에 실패했습니다. 다시 시도해 주세요');
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const userData = {
      userId: userId,
      userEmail: userEmail,
    };

    if (verificationCode !== emailCode) {
      alert('인증번호가 올바르지 않습니다.');
      return;
    }
    //아이디와 이메일을 가진 유저가 있는지 확인한다.
    const response = await fetch('http://localhost:8080/api/find/psw', {
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      alert('성공');
      
      sessionStorage.setItem('userId',userId);
      sessionStorage.setItem('userEmail',userEmail);
      navigate('/ModifyPsw')
    }
  };

  return (
    <div className="login-container">
      <h1 className="logo">KNOT</h1>
      <form onSubmit={handleSubmit} action='method' className="findfw-form">
        <div className="input-group">
          <input name='userId' className='input-fw' type="text" placeholder="아이디" value={userId} onChange={(e) => setuserId(e.target.value)}  required />
          <div>
          <input name='userEmail' className='input-fw'  type="email"  placeholder="이메일"   value={userEmail} onChange={(e) => setuserEmail(e.target.value)} required />
          <button onClick={handleEmailVerification} className="emailVer" type="button">인증</button>
          </div>
          <input name="EmailCd" className="input-join" type="text" placeholder="이메일 인증코드 입력" value={emailCode} onChange={(e) => setEmailCode(e.target.value)} required/>
          <button type="submit" className="find-fw">비밀번호 찾기</button>
        </div>
      </form>
      <div id='links'>
        <span className="register-link" onClick={FindId}>
          아이디 찾기
        </span>
        <span className="register-link" onClick={handleTextClick}>
          로그인 하러가기
        </span>
      </div>
    </div>
  );
}

export default FindFW;
