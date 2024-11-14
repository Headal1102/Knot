import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import SideBar from './sideBar';
import Diary from '../pages/Diary';
import '../css/root.css';
import '../css/NewDiary.css';

function NewDiary() {
  const userId=sessionStorage.getItem('userId');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [weather, setWeather] =useState('');
  const date = new Date();
  const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
  const ContentData={
    userId:userId,
    DiaryTitle:title,
    DiaryText: content,
    DiaryWeather:weather,
    DiaryDate:today
  }
  const navigate = useNavigate();

  const navtoMain = () => {
    navigate("/main");
  }

  const saveNewDiary = () => {
    fetch('http://localhost:8080/api/diaries/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ContentData),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert('다이어리 저장 완료!');
      navigate('/main');
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
          <select className="DiaryNew-Weather" onChange={(e) => setWeather(e.target.value)}>
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
          <button className="Btn-CancelDiary" onClick={navtoMain}>작성취소</button>
          <button className="Btn-PostDiary" onClick={saveNewDiary}>작성하기</button>
        </div>
      </div>
    </div>
  );
}

export default NewDiary;
