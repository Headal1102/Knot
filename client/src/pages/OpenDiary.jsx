import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import SideBar from './sideBar';
import Diary from '../pages/Diary';

import '../css/OpenDiary.css';

function OpenDiary(){
  const userId=sessionStorage.getItem('userId');
  const { DiaryCd } = useParams();
  const [diaries, setDiaries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [weather, setWeather] =useState('');
  const ContentData={
    userId:userId,
    DiaryTitle:title,
    DiaryText: content,
    DiaryWeather:weather,
    DiaryCd:DiaryCd
  }
  const navigate = useNavigate();
  const navtoMain = () => {
    navigate("/main");
  }
  const UpdateDiary = () => {
    fetch('http://localhost:8080/api/diaries/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ContentData),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert('다이어리 수정 완료!');
      navigate('/main');
    })}
  useEffect(() => {
    fetch(`http://localhost:8080/api/diaries/${userId}/${DiaryCd}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setDiaries(data);
        setTitle(data.DiaryTitle); // 초기값 설정
        setContent(data.DiaryText); // 초기값 설정
        setWeather(data.DiaryWeather); // 초기값 설정
      })
      .catch((error) => {
        console.error('Error fetching diaries:', error);
      });
  }, [userId, DiaryCd]);
  const Delete= async()=>{
    try {
        const response = await fetch(`http://localhost:8080/api/diaries/delete`, {
          method: 'POST',  // 수정할 때는 'POST'로 변경
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(ContentData),
        });
  
        if (response.ok) {
          alert('삭제 완료.');
          navigate('/main');
        } else {
          alert('삭제 실패.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('네트워크 오류가 발생했습니다.');
      }
}
  return (
    <div id="box">
      <SideBar user={sessionStorage.userId}></SideBar>
      <div id="NewDiary-box" className="NewDiary-Box">
        <h2>오늘의 다이어리</h2>
        <div id="diaryHead" className="Diary">
          <input
            className="NewDiaryTitle"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // 상태 변경
          />
          <select
            className="DiaryNew-Weather"
            value={weather} // 초기값을 반영
            onChange={(e) => setWeather(e.target.value)}
          >
            <option value="맑음">맑음</option>
            <option value="흐림">흐림</option>
            <option value="소나기">소나기</option>
            <option value="비">비</option>
            <option value="눈">눈</option>
          </select>
        </div>
        <div className="Diary">
          <textarea
            className="NewDiaryContent"
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)} // 상태 변경
          />
        </div>
        <div id="buttonBox" className="Diary">
          <button className="Btn-CancelDiary" onClick={Delete}>
            삭제하기
          </button>
          <button className="Btn-PostDiary" onClick={UpdateDiary}>
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
  
}


export default OpenDiary;
