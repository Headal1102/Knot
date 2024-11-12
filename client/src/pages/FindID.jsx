import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FindID.css';

function FindID() {

  const navigate = useNavigate(); 

  const handleTextClick = () => {
    navigate('/Login'); 
  };
  const [userId, setuserId] = useState('');
  const [userEmail, setuserEmail] = useState('');
  const [emailCode, setEmailCode]=useState('');
  const [verificationCode, setVerificationCode] = useState(''); // 인증코드 상태

  const handleSubmit = async(e) => {
    
    e.preventDefault();

    const userData = {
      userEmail: userEmail,
    };

    const response = await fetch('/api/find/id', {
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData),
    });
    
  };
  // const userData = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/userData/${user}`, {
  //       method: 'GET',
  //     })
  //     .then(response=>{
  //       if (!response.ok) {
  //         throw new Error('데이터를 불러오지 못했습니다.');
  //       }
  //       return response.json();
  //     })
  //      .then(data => {
  //           console.log('데이터:', data);
  //           if (data) {
  //             setuserEmail(data.userEmail);
  //             setuserId(data.userId);
  //           }
  //       })
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('네트워크 오류가 발생했습니다.');
  //   }
  //   //AnswerId.jsx에 userId와 userEmail 데이터 보내지
  // };

  return (
    <div className="login-container">
      <h1 className="logo">KNOT</h1>
      <form onSubmit={handleSubmit} action='method' className="findid-form">
        <div className="input-group">
          <input name='email' className='input-id'
            type="email"
            placeholder="이메일 입력"
            value={userEmail}
            onChange={(e) => setuserEmail(e.target.value)}
            required
          />
          {/* onClick={handleEmailVerification} */}
           <button className='emailVer' type="button" >이메일 인증</button>
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
        <button type="submit" className="Find-ID">아이디 찾기</button>
      </form>
      <span className="register-link" onClick={handleTextClick}>
        로그인하러가기
      </span>
    </div>
  );
}

export default FindID;
