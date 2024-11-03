import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/sideBar.css';
export default function SideBar({ today, user }) {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userImg, setUserImg] = useState('');
    const [userMsg, setUserMsg] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/api/userData/${user}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('데이터를 불러오지 못했습니다.');
            }
            return response.json();
        })
        .then(data => {
            console.log('데이터:', data);
            if (data) {
                setUserName(data.userName);  // userName 설정
                setUserImg(data.userImg);    // userImg 설정
                setUserMsg(data.userMsg);
            }
        })
        .catch(error => console.error('세션 정보 가져오기 오류:', error));
    }, [user]); // user가 변경될 때마다 실행

    const logOut = () => {
        fetch('/api/mypage/logout', {
            method: 'POST',
            credentials: 'include'
        })
        .then(() => {
            navigate('/'); // 로그아웃 후 로그인 페이지로 이동
        })
        .catch(error => console.error('로그아웃 오류:', error));
    };
    const myPageHandler= (path) => {
        navigate(path); 
      };
    return (
        <div id="sideBar">
            <h1 id='logo'>KNOT</h1>
            <div id="userProfile">
                <img id="userImg" src={userImg} alt="유저사진" onClick={() => myPageHandler('/mypage')} />
                <h3 id="userName" onClick={() => myPageHandler('/mypage')}>{userName}</h3>
                <h2 id='userMsg' onClick={() => myPageHandler('/mypage')}>{userMsg}</h2>
            </div>
            <h3 id='logout' onClick={logOut}>로그아웃</h3>
        </div>
    );
}

