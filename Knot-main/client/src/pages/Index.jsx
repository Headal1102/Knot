import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Login from './Login';
import '../css/Index.css'
import KnotLogo from '../assets/logo.png'
import knot1 from '../assets/Knot1.png';
function Index() {
  const navigate = useNavigate();
  
  const navtoLogin = () => {
    navigate("/Login");
  }
  const navtoIndex=()=>{
    navigate("/");
  }
  
  return (
    <>
    <nav>
      <div id='Logos' onClick={() => navtoIndex('/')}>
         <img src={KnotLogo} alt="Knot로고사진" />
         <h1 id='Knot'>KNOT</h1>
      </div>
      <ul id='menu'>
        <li>KNOT란?</li>
        <li>팀소개</li>
        <li onClick={() => navtoLogin('/login')}>로그인</li>
      </ul>
    </nav>
    <div className="container">
      <div id='container1-1'>
        <img id='knotImg1' src={knot1} alt="Knot 사진 예시" />
        <img id='KnotLogo' src={KnotLogo} alt="Knot로고" />
      </div>
      <div id='container1-2'> 
          <h1 id='desTop'>
            KNOT<br/>:하루의 매듭을 짓다
          </h1>
          <div id='desMid'>
            <h2>한 눈에 보이는 화면으로 간단하게하는 <span className='mainColor'>일정 관리</span></h2>
            <h2>하루의 마지막을 할 수 있는 <span className='mainColor'>다이어리 작성</span></h2>
            <h2><span className='mainColor'>KNOT</span>와 함께 해보세요!</h2>
          </div>
        <button id='loginBar' onClick={() => navtoLogin('/login')}>
          Knot와 함께하기
        </button>
      </div>
    </div>
    <div className="container">
      팀소개 & 제작한 이유
    </div>
    <div className="container">
      기능들1
    </div>
    <div className="container">
      기능들2
    </div>
    <div className="container">
      로그인을 독려함
    </div>
    <footer>
      <div>
        <h1>KNOT</h1>
        <h4>프론트엔드 : 김기순 김승휘 엄다영</h4>
        <h4>백엔드 : 김서우 박태수 양민지</h4>
        <h5>&#169; JEIU UNIV Team.일석이조</h5>
      </div>
    </footer>
    </>
  );
}

export default Index;