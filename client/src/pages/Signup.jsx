import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Joinform.css';

export default function Signup() {
  const navigate = useNavigate();

  const handleTextClick = () => {
    navigate('/Login'); 
  };

  const [userId, setuserId] = useState('');
  const [userName, setName] = useState('');
  const [userPsw, setuserPsw] = useState('');
  const [confirmuserPsw, setConfirmuserPsw] = useState('');
  const [userEmail, setuserEmail] = useState('');
  const [userBirth, setuserBirth] = useState('');
  const [userGender, setuserGender] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); // 인증코드 상태

  const handleEmailVerification = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userEmail}),
      });

      if (response.ok) {
        const data= await response.json();
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 일치 여부 확인
    if (userPsw !== confirmuserPsw) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if(verificationCode!==emailCode){
      alert('인증번호가 일치하지 않습니다.');
      return;
    }

    const userData = {
      userId,
      userName,
      userPsw,
      userEmail,
      userBirth,
      userGender,
      emailCode,
    };

    try {
      const response = await fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('회원가입 성공:', jsonResponse);
        navigate('/Login');
      } else {
        const errorResponse = await response.text();
        console.error('회원가입 실패:', errorResponse);
        alert('회원가입에 실패했습니다: ' + errorResponse);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signup-container">
      <h1 className="logo">KNOT</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-jf">
          <input name='userName' className='input-join'
            type="text"
            placeholder="이름"
            value={userName}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-jf">
          <input name='userId' className='input-join'
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setuserId(e.target.value)}
            required
          />
        </div>
        <div className="input-jf">
          <input name='userPsw' className='input-join'
            type="password"
            placeholder="비밀번호"
            value={userPsw}
            onChange={(e) => setuserPsw(e.target.value)}
            required
          />
        </div>
        <div className="input-jf">
          <input name='confirmuserPsw' className='input-join'
            type="password"
            placeholder="비밀번호 확인"
            value={confirmuserPsw}
            onChange={(e) => setConfirmuserPsw(e.target.value)}
            required
          />
        </div>
        <div className="input-jf">
          <input name='userEmail' className='input-join'
            type="email"
            placeholder="이메일"
            value={userEmail}
            onChange={(e) => setuserEmail(e.target.value)}
            required
          />
          <button className='emailVer' type="button" onClick={handleEmailVerification}>이메일 인증</button>
        </div>
        <div className="input-jf">
          <input name='EmailCd' className='input-join'
            type="text"
            placeholder="이메일 인증코드 입력"
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
            required
          />
        </div>
        <div className="input-jf">
          <input name='userBirth' className='input-join'
            type="date"
            placeholder="생년월일"
            value={userBirth}
            onChange={(e) => setuserBirth(e.target.value)}
            required
          />
        </div>
        <div className="gender-jf">
          <label>성별 : </label>
          <select value={userGender} onChange={(e) => setuserGender(e.target.value)}>
            <option value="F">여</option>
            <option value="M">남</option>
            <option value="N">밝히고 싶지않음</option>
          </select>
        </div>
        <button type="submit" className="signup-button">회원가입</button>
      </form>
      <div>
        이미 회원이신가요?
        <span className='login-link' onClick={handleTextClick}> 로그인하기</span>
      </div>
    </div>
  );
}
