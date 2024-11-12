import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import SideBar from './sideBar';
import Diary from '../pages/Diary';
import '../css/root.css';
import '../css/NewDiary.css';

function NewDiary() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const navigate = useNavigate();

  const navtoDiary = () => {
    navigate("/diary");
  }

  const saveNewDiary = () => {
    // 상태값 출력하여 확인
    console.log('Title:', title);  // 제목 값 확인
    console.log('Content:', content);  // 내용 값 확인

    // 다이어리 생성 API 호출 (POST 요청)
    fetch('http://localhost:8080/api/diaries/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Diary created:', data);  // 다이어리 생성 성공 로그
      navigate("/main"); // 다이어리 생성 후 목록 페이지로 이동
    })
    .catch(error => console.error('Error creating diary:', error));  // 오류 로그
  }

  return (
    <div id='box'>
    <SideBar user={sessionStorage.userId}></SideBar>
      <div id='NewDiary-box' className="NewDiary-Box">
        <h2>오늘의 다이어리</h2>
        <div id='diaryHead' className='Diary'>
          <input className="NewDiaryTitle" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)}/>
          <select className="DiaryNew-Weather">
            <option value="맑음">맑음</option>
            <option value="흐림">흐림</option>
            <option value="소나기">소나기</option>
            <option value="비">비</option>
            <option value="눈">눈</option>
          </select>
        </div>
        <div className='Diary'>
           <textarea className="NewDiaryContent" placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)}/>
        </div>
        <div id='buttonBox' className="Diary">
          <button className="Btn-CancelDiary" onClick={navtoDiary}>작성취소</button>
          <button className="Btn-PostDiary" onClick={saveNewDiary}>작성하기</button>
        </div>
      </div>
    </div>
  );
}

export default NewDiary;
