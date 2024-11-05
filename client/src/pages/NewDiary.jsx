import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import SideToolBar from '../components/SideToolBar';
import Diary from '../pages/Diary';

import '../css/NewDiary';

function NewDiary() {
  const navigate = useNavigate();

  const navtoDiary = () => {
    navigate("/diary")
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/diary' element={<Diary />} />
      </Routes>
    </BrowserRouter>,
    <>
      <SideToolBar />
      <div className="NewDiary-Box">
        <input className="NewDiaryTitle" placeholder="제목"></input>
        <textarea className="NewDiaryContent" placeholder="내용"></textarea>
        <div className="NewDiaryBtnGroup">
            <button className="Btn-CancelDiary" onClick={navtoDiary}>작성취소</button>
            <button className="Btn-PostDiary" onClick={navtoDiary}>작성하기</button>
        </div>
      </div>
    </>
  );
}

export default NewDiary;
