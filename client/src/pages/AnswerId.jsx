import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Session from 'react-session-api';
export default function AnswerId(){
    const navigate = useNavigate();
    const userId=sessionStorage.getItem("userId");
    return(
        <div id='AnswerCon'>
            <h1 id='logo'>KNOT</h1>
            <div id='AnswerId'>
                <h1>아이디</h1>
                <h1>{userId}</h1>
            </div>
            <div id='links'>
                <span onClick={() => navigate('/FindPw')}>비밀번호 찾기</span>
                <span onClick={() => navigate('/Login')}>로그인</span>
            </div>
        </div>
    )
}