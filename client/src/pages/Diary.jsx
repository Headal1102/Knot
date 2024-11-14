import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from './sideBar';
import '../css/Diary.css';
import '../css/DiaryList.css';
import DiaryIcons from './DiaryIcon';
import DatePicker from 'react-datepicker';
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiPencilLine } from "react-icons/ri";
function Diary() {
  const userId=sessionStorage.getItem('userId');
  const [diaries, setDiaries] = useState([]);
  const [error, setError] = useState(null);   // 오류 상태 추가
  const navigate = useNavigate();

  // 다이어리 목록을 백엔드에서 불러오는 useEffect (GET 요청)
  useEffect(() => {
    fetch(`http://localhost:8080/api/diaries/${userId}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setDiaries(data); // 다이어리 데이터를 상태에 저장
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error fetching diaries:', error); // 오류 로그 출력
      });
  }, [diaries]);

  const navtoNewDiary = () => {
    navigate("/newdiary");
  };

  const navtoOpenDiary = (DiaryCd) => {
    navigate(`/opendiary/${DiaryCd}`);
  };

  
  return (
    <>
      <div className="Main-Box">
        <div className="Split-Row">
          <div className="DiaryList-Box">
            <h3 id="Menu-Title">Diary</h3>
            <div className="Diary-Menu">
              <div className="Diary-NewDateForm">
              </div>
              <button className="Btn-NewDiary" onClick={() => navtoNewDiary()}></button>
            </div>
            <div className="DiaryLists-Box">
              <ul className="DiaryLists">
              {diaries.length > 0 ? (
            diaries.map((diary) => (
              <li key={diary.DiaryCd} className="DiaryCard">
                <span>{diary.DiaryDate.split('T')[0]}</span>
                <div id='Contents'>
                  <p className="DiaryTitle" onClick={() => navtoOpenDiary(diary.DiaryCd)}>{diary.DiaryTitle}</p>
                <DiaryIcons DiaryCd={diary.DiaryCd}></DiaryIcons>
                </div>
                
              </li>
            ))
          ) : (
            <p>작성된 다이어리가 없습니다.</p>
          )}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Diary;
