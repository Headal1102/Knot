import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from './sideBar';
import '../css/Diary.css';
import DatePicker from 'react-datepicker';

function Diary() {
  const [diaries, setDiaries] = useState([]);
  const [error, setError] = useState(null);   // 오류 상태 추가
  const navigate = useNavigate();

  // 다이어리 목록을 백엔드에서 불러오는 useEffect (GET 요청)
  useEffect(() => {
    fetch('http://localhost:8080/api/diaries')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setDiaries(data.diaries)) // 다이어리 데이터를 상태에 저장
      .catch((error) => {
        setError(error.message);
        console.error('Error fetching diaries:', error); // 오류 로그 출력
      });
  }, []);

  const navtoNewDiary = () => {
    navigate("/newdiary");
  };

  const navtoOpenDiary = (id) => {
    navigate("/opendiary/" + id);
  };

  // if (error) {
  //   return <div>오류 발생: {error}</div>;
  // }
  // const [startDate, setStartDate] = useState(new Date());
  
  return (
    <>
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
                {/* <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                /> */}
              </div>
              <button className="Btn-NewDiary" onClick={() => navtoNewDiary(1)}></button>
            </div>
            <div className="DiaryLists-Box">
              <ul className="DiaryLists">
              {diaries.length > 0 ? (
            diaries.map((diary) => (
              <li key={diary.id} className="DiaryCard" onClick={() => navtoOpenDiary(diary.id)}>
                <p className="DiaryTitle">{diary.title}</p>
                <p className="DiaryContent">{diary.content}</p>
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
