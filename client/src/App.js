import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route,  useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FindID from './pages/FindID';
import FindFW from './pages/FindFW';
// import Info from './pages/Info';
import Index from './pages/Index';
import Main from './pages/Main';
import MyPage from './pages/Mypage';
import Diary from './pages/Diary';
import DiaryEdit from './pages/DiaryEdit';
import MyPageModify from './pages/myPageModify';
import axios from 'axios';
import Todo from './pages/Todo';
import NewDiary from './pages/NewDiary';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Index/>}/>
        <Route path='/main' element={<Main/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/findId" element={<FindID />} />
        <Route path="/findPw" element={<FindFW />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/diary/:id" element={<Diary />} />
        <Route path="/newdiary" element={<NewDiary/>} />
        <Route path="/diary/:id/edit" element={<DiaryEdit />} />
        <Route path="/mypage/modify" element={<MyPageModify />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </Router>
  );
}

export default App;
