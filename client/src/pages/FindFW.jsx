import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FindFW.css';

function FindFW() {

  const navigate = useNavigate(); 

  const handleTextClick = () => {
    navigate('/Login'); 
  };

  const [id, setId] = useState('');
  const [email, setemail] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();

    const userData = {
      userId: id,
      userEmail: email,
    };

    const response = await fetch('http://localhost:8080/api/find/psw', {
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData),
    });
    
  };

  return (
    <div className="login-container">
      <h1 className="logo">KNOT</h1>
      <form onSubmit={handleSubmit} action='method' className="findfw-form">
        <div className="input-group">
          <input name='id' className='input-fw'
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input name='email' className='input-fw'
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="find-fw">비밀번호 찾기</button>
      </form>
      <span className="register-link" onClick={handleTextClick}>
        로그인 하러가기
      </span>
    </div>
  );
}

export default FindFW;
