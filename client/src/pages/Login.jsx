import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import Session from 'react-session-api';

function Login() {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

let localStorage=window.localStorage;

  const handleNavigate = (path) => {
    navigate(path); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      userId: id,
      userPsw: password,
    };

    // 로그인 API 호출
    const response = await fetch('http://localhost:8080/api/login', {
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      Session.set("userId",id);
      sessionStorage.setItem("userId",id);
      navigate('/main'); // 성공 시 홈으로 이동
    } else {
      alert('아이디나 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="logo">KNOT</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <input
            name='id'
            className='input'
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            name='password'
            className='input'
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="remember-and-find">
          <div className="checkbox-group">
            <label>
              <input type="checkbox" name='check' />
              아이디 기억하기
            </label>
          </div>
          <div className="find_idfw-container">
            <span className='find_idfw' onClick={() => handleNavigate('/FindID')}>아이디</span>
            <span className='find_idfw' onClick={() => handleNavigate('/FindPw')}>/비밀번호 찾기</span>
          </div>
        </div>
        <button type="submit" className="login-button" >로그인</button>
      </form>
      <span className='register-link' onClick={() => handleNavigate('/signup')}>
        아직 회원이 아니신가요?
      </span>
    </div>
  );
}

export default Login;
