// ===============================================================
// Title : Index.js
// ===============================================================
// Description :
// This file is for '/index' page.
// ===============================================================
// Author : EomDayoeng
// Last Modified : 2024.10.22
// Version : 1.0
// ===============================================================

// <<< Library >>> //
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
// <<< Page >>> //
// import Login from "./Login";
import Login from './Login';

// <<< CSS >>> //
import '../css/Index.css'


// <<< Page Render >>> //
function Index() {
  const navigate = useNavigate();
  
  const navtoSignIn = () => {
    navigate("/Login");
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>,
    <>
    <div className="Index-Box">
    <div className="TopMenu">
      <div className="Index-Logo">KNOT</div>
      <div className="TopMenuGroup">
        <Link className="TopMenu-Nav" to={"/index"}>웹소개</Link>
        <Link className="TopMenu-Nav" to={"/team"}>팀소개</Link>
        <Link className="TopMenu-Nav" to={"/Login"}>로그인</Link>
      </div>
    </div>
    <div className="Introduce">
      <div className="intro_1">
        <button className="intro_btnSignIn1" onClick={navtoSignIn}>로그인</button>
      </div>
      <div className="intro_2"></div>
      <div className="intro_3"></div>
      <div className="intro_4">
        <button className="intro_btnSignIn2" onClick={navtoSignIn}>로그인</button>
      </div>
    </div>
  </div>
</>
  );
}

export default Index;
