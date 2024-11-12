import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Main from "./Main";
import "../css/DiaryEdit.css";
// <<< Page Render >>> //
function DiaryEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const navtoDiary = (id) => {
    navigate("/diary/" + id)
  }

  const DiaryEditCancle = (id) => {
    if (window.confirm("수정을 취소하시겠습니까?")) {
      //Hint : 여기에 다이어리 수정 취소와 관련된 백엔드와의 연동 내용 작성

      navtoDiary(id);
    }
  }

  const DiaryEditSave = (id) => {
    //Hint : 여기에 다이어리 작성과 관련된 백엔드와의 연동 내용 작성

    navtoDiary(id);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/main' element={<Main />} />
      </Routes>
    </BrowserRouter>,
    <>
      {/* <SideToolBar /> */}
      <div className="DiaryEdit-Box">
        <input className="DiaryEdit-Title" value={ id }></input>
        <textarea className="DiaryEdit-Content">{ id }</textarea>
        <div className="DiaryEdit-BtnGroup">
            <button className="Btn-DiaryEditCancel" onClick={ () => DiaryEditCancle(id) }>수정취소</button>
            <button className="Btn-DiaryEditSave" onClick={ () => DiaryEditSave(id) }>수정하기</button>
        </div>
      </div>
    </>
  );
}

export default DiaryEdit;
