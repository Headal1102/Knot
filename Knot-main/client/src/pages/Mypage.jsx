import React, { useState, useEffect } from 'react';
import SideBar from './sideBar';

export default function MyPage(){
    const user = sessionStorage.getItem('userId');
    
    return(
        <>
        <SideBar user={user} ></SideBar>
        <h1>임시 마이페이지</h1>
        </>
    );
};