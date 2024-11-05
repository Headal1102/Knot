import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
// import SideToolBar from "../components/SideToolBar";
import SideBar from './sideBar';
import Main from "./Main";
import "../css/DiaryNew.css";
// <<< Page Render >>> //
function DiaryNew() {
  const { id } = useParams();

  const navigate = useNavigate();

  const navtoMain = () => {
    navigate("/main")
  }

  const DiaryNewCancle = (id) => {
    if (window.confirm("작성을 취소하시겠습니까?")) {
      //Hint : 여기에 다이어리 작성 취소와 관련된 백엔드와의 연동 내용 작성

      navtoMain();
    }
  }

  const DiaryNewPost = (id) => {
    //Hint : 여기에 다이어리 작성과 관련된 백엔드와의 연동 내용 작성

    navtoMain();
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/main' element={<Main />} />
      </Routes>
    </BrowserRouter>,
    <>
      {/* <SideToolBar /> */}
      <SideBar></SideBar>
      <div className="DiaryNew-Box">
        <input className="DiaryNew-Title" placeholder="제목"></input>
        <textarea className="DiaryNew-Content" placeholder="내용"></textarea>
        <div className="DiaryNew-BtnGroup">
            <button className="Btn-DiaryNewCancel" onClick={ () => DiaryNewCancle(id) }>작성취소</button>
            <button className="Btn-DiaryNewPost" onClick={ () => DiaryNewPost(id) }>작성하기</button>
        </div>
      </div>
    </>
  );
}

export default DiaryNew;
