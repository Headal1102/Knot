import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Login from './Login';
import '../css/Index.css'
import KnotLogo from '../assets/logo.png'
import knot1 from '../assets/Knot1.png';
import { FaSquareCheck } from "react-icons/fa6";
import { BsCalendar2WeekFill } from "react-icons/bs";
import { BiSolidBook } from "react-icons/bi";
import { FaUser } from "react-icons/fa6";
import { FaGitAlt } from "react-icons/fa";
import { MdAttachEmail, MdEmail } from "react-icons/md";
import { BiSolidSchool } from "react-icons/bi";
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
         <h1 id='Knot'><a href="#KnotTop">KNOT</a></h1>
      </div>
      <ul id='menu'>
        <li><a href="#KNOT">KNOT란?</a></li>
        <li><a href="#TEAM">개발 계기</a></li>
        <li><a href="#footer">문의하기</a></li>
        <li onClick={() => navtoLogin('/login')}>로그인</li>
      </ul>
    </nav>
    <div id='KnotTop' className="container">
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
    <div id='KNOT' className="container">
      <div id='KnotInfo'>
        <div>
        <h1 className='white what'>KNOT란 무엇인가요?</h1>
        <h1 className='white'>'투두리스트'와 '다이어리'가 있는 일정 관리 사이트 입니다.</h1>
        </div>
        <div id='KnotInfoImg'>
          <div>
            <FaUser/>
            <h1>유저only</h1>
          </div>
          <div>
            <BsCalendar2WeekFill/>
            <h1>일정 관리</h1>
          </div>
          <div>
            <FaSquareCheck/>
            <h1>투두리스트</h1>
          </div>
          <div>
            <BiSolidBook/>
            <h1>다이어리</h1>
          </div> 
        </div>
      </div>
    </div>
    <div id='TEAM' className="container">
      <h1 id='TEAMName'>Knot는 왜 만들게 되었나요?</h1>
      <div>
        <h1>Knot는 노트북이나 데스크탑으로 일정을 정리할 수 있으면<br/>
        정말 편하겠다 라는 생각에서 시작되었습니다.</h1>
      </div>
      <div id='arrow'></div>
      <div id='TEAMright'>
        <h1>TEAM 일석이조는<br/>
        그것을 계기로 Knot를 제작하게 되었습니다.</h1>
      </div>
      <div>
        <figure>
          <img src="" alt="" />
        </figure>
      </div>
    </div>
    {/* <div className="container">
      투두리스트
    </div>
    <div className="container">
      다이어리
    </div> */}
    <div id='WithKnot' className="container">
      <div>
        <h1>KNOT와 함께하는 더 나은 하루</h1>
        <button onClick={() => navtoLogin('/login')}>지금 시작하기</button>
      </div>
    </div>
    <footer id='footer'>
      <div>
        <h1>KNOT</h1>
        <h4>프론트엔드 : 김기순 김승휘 엄다영</h4>
        <h4>백엔드 : 김서우 박태수 양민지</h4>
        <div className='footerLinks'>
          <ul>
            <li><a href="mailto:gkrtks030611@gmail.com"><MdEmail></MdEmail></a></li>
            <li><a href="https://github.com/Headal1102/Knot"><FaGitAlt></FaGitAlt></a></li>
            <li><a href="https://dept.jeiu.ac.kr/cit/main/"><BiSolidSchool></BiSolidSchool></a></li>
          </ul>
        </div>
        <h5>&#169; JEIU UNIV Team.일석이조</h5>
      </div>
    </footer>
    </>
  );
}

export default Index;
