import React, { useEffect, useState } from 'react';
import DiaryIcons from './DiaryIcon';
import { useNavigate } from 'react-router-dom';
export default function DiaryList(props){
    const userId=sessionStorage.getItem('userId');
    const [diaries, setDiaries] = useState([]);
    const [error, setError] = useState(null);   // 오류 상태 추가
    const navigate = useNavigate();
    console.log(props.selectedDate);
    useEffect(() => {
        fetch(`http://localhost:8080/api/diaries/${userId}`, {
          method: 'GET',credentials: 'include'
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            setDiaries(data); // 다이어리 데이터를 상태에 저장
          })
          .catch((error) => {
            setError(error.message);
          });
      }, [userId, props.selectedDate]);

      const navtoOpenDiary = (DiaryCd) => {
        navigate(`/opendiary/${DiaryCd}`);
      };
    return(
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
    );
}