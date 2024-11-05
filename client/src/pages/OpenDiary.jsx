import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

import SideToolBar from '../components/SideToolBar';
import Diary from '../pages/Diary';

import '../css/OpenDiary.css';

function OpenDiary() {
  const { id } = useParams();

  const navigate = useNavigate();

  const navtoDiary = () => {
    navigate("/diary")
  }

  const DeleteDiary = () => {    
    
    //여기에 다이어리 삭제 관련 내용 작성

  }

  const EditDiary = (e) => {
    document.getElementsByClassName("OpenDiaryTitle")[0].removeAttribute("readOnly")
    document.getElementsByClassName("OpenDiaryContent")[0].removeAttribute("readOnly")
    document.getElementsByClassName("Btn-ReturnDiary")[0].setAttribute("hidden", true)
    document.getElementsByClassName("Btn-DeleteDiary")[0].setAttribute("hidden", true)
    document.getElementsByClassName("Btn-EditDiary")[0].setAttribute("hidden", true)
    document.getElementsByClassName("Btn-CancleDiary")[0].removeAttribute("hidden")
    document.getElementsByClassName("Btn-SaveDiary")[0].removeAttribute("hidden")
  }

  const SaveDiary = (e) => {
    
    //여기에 다이어리 저장 관련 내용 작성

    document.getElementsByClassName("OpenDiaryTitle")[0].setAttribute("readOnly", true)
    document.getElementsByClassName("OpenDiaryContent")[0].setAttribute("readOnly", true)
    document.getElementsByClassName("Btn-ReturnDiary")[0].removeAttribute("hidden")
    document.getElementsByClassName("Btn-DeleteDiary")[0].removeAttribute("hidden")
    document.getElementsByClassName("Btn-EditDiary")[0].removeAttribute("hidden")
    document.getElementsByClassName("Btn-CancleDiary")[0].setAttribute("hidden", true)
    document.getElementsByClassName("Btn-SaveDiary")[0].setAttribute("hidden", true)
  }
  
  const CancleDiary = () => {
    
    //여기에 다이어리 다시 불러오기 관련 내용 작성

    document.getElementsByClassName("OpenDiaryTitle")[0].setAttribute("readOnly", true)
    document.getElementsByClassName("OpenDiaryContent")[0].setAttribute("readOnly", true)
    document.getElementsByClassName("Btn-ReturnDiary")[0].removeAttribute("hidden")
    document.getElementsByClassName("Btn-DeleteDiary")[0].removeAttribute("hidden")
    document.getElementsByClassName("Btn-EditDiary")[0].removeAttribute("hidden")
    document.getElementsByClassName("Btn-CancleDiary")[0].setAttribute("hidden", true)
    document.getElementsByClassName("Btn-SaveDiary")[0].setAttribute("hidden", true)
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/diary' element={<Diary />} />
        <Route path='/opendiary/:id' element={<OpenDiary />} />
      </Routes>
    </BrowserRouter>,
    <>
      <SideToolBar />
      <div className="OpenDiary-Box">
        <input className="OpenDiaryTitle" defaultValue={ id } readOnly></input>
        <textarea className="OpenDiaryContent" readOnly>{ id }</textarea>
        <div className="OpenDiaryBtnGroup">
            <button className="Btn-ReturnDiary" onClick={navtoDiary}>돌아가기</button>
            <button className="Btn-DeleteDiary" onClick={DeleteDiary}>삭제하기</button>
            <button className="Btn-EditDiary" onClick={EditDiary}>수정하기</button>
            <button className="Btn-CancleDiary" onClick={CancleDiary} hidden>취소하기</button>
            <button className="Btn-SaveDiary" onClick={SaveDiary} hidden>저장하기</button>
        </div>
      </div>
    </>
  );
}

export default OpenDiary;
