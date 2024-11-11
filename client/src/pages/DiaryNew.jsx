import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
// import SideToolBar from "../components/SideToolBar";
import SideBar from './sideBar';
import Main from "./Main";
import "../css/DiaryNew.css";
// <<< Page Render >>> //
function DiaryNew() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const navigate = useNavigate();

  const navtoMain = () => {
    navigate("/main")
  }

  const funcDiaryNewCancle = (id) => {
    if (window.confirm("작성을 취소하시겠습니까?")) {
      //Hint : 여기에 다이어리 작성 취소와 관련된 백엔드와의 연동 내용 작성

      navtoMain();
    }
  }

  const funcDiaryNewPost = (id) => {
    //Hint : 여기에 다이어리 작성과 관련된 백엔드와의 연동 내용 작성

    navtoMain();
  }
  
  const saveNewDiary = () => {
    // 상태값 출력하여 확인
    console.log('Title:', title);  // 제목 값 확인
    console.log('Content:', content);  // 내용 값 확인

    // 다이어리 생성 API 호출 (POST 요청)
    fetch('http://localhost:8080/api/diaries', {
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
      navigate("/diary"); // 다이어리 생성 후 목록 페이지로 이동
    })
    .catch(error => console.error('Error creating diary:', error));  // 오류 로그
  }

  return (
    <>
      <SideBar></SideBar>
      <div className="DiaryNew-Box">
        <div className="DiaryNew-Box-Row">
          <input className="DiaryNew-Title" placeholder="제목"></input>
          <select className="DiaryNew-Weather">
            <option value="맑음">맑음</option>
            <option value="흐림">흐림</option>
            <option value="소나기">소나기</option>
            <option value="비">비</option>
            <option value="눈">눈</option>
          </select>
        </div>
        <textarea className="DiaryNew-Content" placeholder="내용"></textarea>
        <div className="DiaryNew-BtnGroup">
            <button className="Btn-DiaryNewCancel" onClick={ () => funcDiaryNewCancle(id) }>작성취소</button>
            <button className="Btn-DiaryNewPost" onClick={ () => funcDiaryNewPost(id) }>작성하기</button>
        </div>
      </div>
    </>
  );
}

export default DiaryNew;
