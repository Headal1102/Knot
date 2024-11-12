import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

import SideBar from './sideBar';
import Diary from '../pages/Diary';

import '../css/OpenDiary.css';

function OpenDiary() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/api/diaries/${id}`)
      .then(response => response.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(error => console.error('Error fetching diary:', error));
  }, [id]);

  const navtoDiary = () => {
    navigate("/diary")
  }

  const DeleteDiary = () => {    
    // 다이어리 삭제 API 호출 (DELETE 요청)
    fetch(`http://localhost:5000/api/diaries/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      console.log('Diary deleted');
      navigate("/diary"); // 삭제 후 다이어리 목록으로 이동
    })
    .catch(error => console.error('Error deleting diary:', error));

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
    fetch(`http://localhost:8080/api/diaries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Diary updated:', data);
      document.getElementsByClassName("OpenDiaryTitle")[0].setAttribute("readOnly", true);
      document.getElementsByClassName("OpenDiaryContent")[0].setAttribute("readOnly", true);
      document.getElementsByClassName("Btn-ReturnDiary")[0].removeAttribute("hidden");
      document.getElementsByClassName("Btn-DeleteDiary")[0].removeAttribute("hidden");
      document.getElementsByClassName("Btn-EditDiary")[0].removeAttribute("hidden");
      document.getElementsByClassName("Btn-CancleDiary")[0].setAttribute("hidden", true);
      document.getElementsByClassName("Btn-SaveDiary")[0].setAttribute("hidden", true);
    })
    .catch(error => console.error('Error updating diary:', error));
  }
  
  const CancleDiary = () => {
    fetch(`http://localhost:8080/api/diaries/${id}`)
      .then(response => response.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(error => console.error('Error reloading diary:', error));

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
    <SideBar></SideBar>
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
