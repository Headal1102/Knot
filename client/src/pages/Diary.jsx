import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';

// <<< Component >>> //
// import SideToolBar from "../components/SideToolBar";
// import SideBar from './sideBar';

// // <<< Page >>> //
// import SignIn from "./SignIn";
// import Diary from "./Diary";
import DiaryNew from "./DiaryNew";
import DiaryEdit from "./DiaryEdit";

// <<< CSS >>> //
// import "./Main.css";
import '../css/Diary.css';
import "react-datepicker/dist/react-datepicker.css";



// <<< Page Render >>> //
export default function Diary()  {
  const navigate = useNavigate();
  
  const navtoDiaryNew = (id) => {
    navigate("/diary/" + id + "/new");
  }
  
  const navtoDiary = (id) => {
    navigate("/diary/" + id);
  }
  
  const deleteDiary = () => {
    if (window.confirm("삭제하시겠습니까?")) {
      //Hint : 여기에 다이어리 삭제와 관련된 백엔드와의 연동 내용 작성

      window.location.reload();
    }
  }

  const [startDate, setStartDate] = useState(new Date());

  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/diary/:id" element={<Diary />} />
        <Route path="/diary/:id/new" element={<DiaryNew />} />
        <Route path="/diary/:id/edit" element={<DiaryEdit />} />
      </Routes>
    </BrowserRouter>,
    <>
      {/* <SideBar /> */}
      <div className="Main-Box">
        <div className="Split-Row">
          {/* <div className="Split-Column"> */}
            {/* <div className="Calendar-Box">
              <h3 id="Menu-Title">Calendar</h3>
            </div> */}
            {/* <div className="ToDo-Box">
              <h3 id="Menu-Title">ToDo</h3>
            </div> */}
          {/* </div> */}
          <div className="DiaryList-Box">
            <h3 id="Menu-Title">Diary</h3>
            <div className="Diary-Menu">
              <div className="Diary-NewDateForm">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <button className="Btn-NewDiary" onClick={() => navtoDiaryNew(1)}></button>
            </div>
            <div className="DiaryLists-Box">
              <ul className="DiaryLists">
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}