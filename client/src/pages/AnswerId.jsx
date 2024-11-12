import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Session from 'react-session-api';
import '../css/AnswerId.css'
export default function AnswerId(){
    const navigate = useNavigate();
    const navtoIndex=()=>{
        navigate("/");
      }
    const userId=sessionStorage.getItem("userId");
    const destroy = () => {
        sessionStorage.removeItem("userId"); // Use removeItem to delete userId
    };
    return(
        <div id='AnswerCon'>
            <h1 id='logo' onClick={() => navtoIndex('/')}>KNOT</h1>
            <div id='AnswerId'>
                <h2>아이디</h2>
                <h1>{userId}</h1>
            </div>
            <div id='links'>
                <span onClick={() => {destroy(); navigate('/FindPw');}}>비밀번호 찾기</span>
                <span onClick={() => {destroy(); navigate('/Login');}}>로그인</span>
            </div>
        </div>
    )
}