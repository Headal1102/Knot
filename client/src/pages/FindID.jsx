import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FindID.css';
import Session from 'react-session-api';

function FindID() {
  const navigate = useNavigate(); 
  const [userEmail, setUserEmail] = useState('');
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
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  // 아이디 찾기 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (verificationCode !== emailCode) {
      alert('인증번호가 올바르지 않습니다.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/userData/findid/${userEmail}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('데이터를 불러오지 못했습니다.');
      }

      const data = await response.json();
      if (data) {
        Session.set("userId", data.userId);
        sessionStorage.setItem("userId", data.userId);
        navigate('/AnswerId');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="logo">KNOT</h1>
      <form onSubmit={handleSubmit} className="findid-form">
        <div className="input-group">
          <div>
            <input
              name="email"
              className="input-id"
              type="email"
              placeholder="이메일 입력"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <button onClick={handleEmailVerification} className="emailVer" type="button">
              인증
            </button>
          </div>
          <input
            name="EmailCd"
            className="input-join"
            type="text"
            placeholder="이메일 인증코드 입력"
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
            required
          />
          <button type="submit" className="Find-ID">
            아이디 찾기
          </button>
        </div>
      </form>
      <div id="links">
        <span className="register-link" onClick={() => navigate('/FindPw')}>
          비밀번호 찾기
        </span>
        <span className="register-link" onClick={() => navigate('/Login')}>
          로그인하러가기
        </span>
      </div>
    </div>
  );
}

export default FindID;

