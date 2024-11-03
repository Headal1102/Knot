import React,{useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// import Home from "../pages/Home"
// import Calendar from "../pages/Calendar"
// import Todo from "../pages/Todo"
// import Diary from "../pages/Diary"

import '../css/SideToolBar.css';

export default class SideBar extends React.Component {
  render () {
    return (
      <div className="SideToolBar-Box">
        <div className="SideToolBar">
          <img className="Logo"></img>
          <div className="Profile">
            <img className="Profile-Img"></img>
            <p className="Profile-Name">홍길동</p>
          </div>
          <div className="SignOut">
            <Link to="/">로그아웃</Link>
          </div>
        </div>
      </div>  
    )
  }
}
