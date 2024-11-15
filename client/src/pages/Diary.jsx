import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Diary.css';
import '../css/DiaryList.css';
import { FiPlusCircle } from "react-icons/fi";
import DiaryList from './DiaryList';
import { RxReset } from "react-icons/rx";
function Diary() {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const navtoNewDiary = () => {
    navigate("/newdiary");
  };
  const handleDateChange = (event) => {
      setDate(event.target.value);
  };
  const reset=()=>{
    window.location.reload();
  }
  return (
    <>
      <div className="Main-Box">
        <div className="Split-Row">
          <div className="DiaryList-Box">
            <div id='DiaryTitles'>
            <h3 id="Menu-Title">Diary</h3>
            <FiPlusCircle className="Btn-NewDiary" onClick={() => navtoNewDiary()}/>
            </div>
            <div className="Diary-Menu">
              <div className="Diary-NewDateForm">
              <input type="date" value={date} onChange={handleDateChange}/>
              <RxReset className='icon' onClick={reset}></RxReset>
              </div>
            </div>
            <DiaryList selectedDate={date}></DiaryList>
          </div>
        </div>
      </div>

    </>
  );
}

export default Diary;
