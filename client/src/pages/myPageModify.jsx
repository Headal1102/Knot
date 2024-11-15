import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from './sideBar';
import '../css/mypage.css';

export default function MyPageModify() {
  const navigate = useNavigate();

  const user = sessionStorage.getItem('userId');
  const [userInfo, setUserInfo] = useState({
    userId:user,
    userName: '',
    userImg: '',
    userMsg: '',
    userEmail: '',
    userBirth: '',
    userGender: ''
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/userData/${user}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('데이터를 불러오지 못했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        console.log('데이터:', data);
        if (data) {
          const birthDate = new Date(data.userBirth); // 날짜를 Date 객체로 변환
          const kstBirthDate = new Date(birthDate.getTime() + 9 * 60 * 60 * 1000); // UTC에서 KST로 변환
  
          setUserInfo({
            userId: user,
            userName: data.userName,
            userImg: data.userImg,
            userMsg: data.userMsg,
            userEmail: data.userEmail,
            userGender: data.userGender,
            userBirth: kstBirthDate.toISOString().substring(0, 10), // YYYY-MM-DD 형식으로 저장
          });
        }
      })
      .catch((error) => console.error('세션 정보 가져오기 오류:', error));
  }, [user]);
  

  // 실시간으로 값 수정
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 회원 정보 수정 처리
  const userModify = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/mypage/modify', {
        method: 'put',  // 수정할 때는 'POST'로 변경
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        const data = await response.json();
        alert('회원 정보 수정 완료.');
        navigate('/mypage');
      } else {
        alert('회원 정보 수정 실패.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div className='myPage'>
      <SideBar user={user}></SideBar>
      <div className='profile-container'>
        <div className='myPageMain'>
          <div className='profile-header'>
            <h1 className='profile'>정보 수정</h1>
            <img className='userImg' src={userInfo.userImg} alt='없음' />
            <input type='text' value={userInfo.userName} className='userName' name='userName' onChange={handleChange}/>
            <input type='text' value={userInfo.userMsg} className='userMsg' name='userMsg' onChange={handleChange} />
          </div>
          <div className='profile-form'>
            <label>
              사용자 ID: <input type='text' value={user} name='userId' disabled />
            </label>
            <label>
              이메일:
              <input
                type='email'
                value={userInfo.userEmail}
                name='email'
                onChange={handleChange}
                disabled
              />
            </label>
            <label>
              생년월일:
              <input
                type='text'
                value={userInfo.userBirth.substring(0, 10)}
                name='userBirth'
                onChange={handleChange}
              />
            </label>
            <label>
              성별:
              <select
                name='userGender'
                value={userInfo.userGender}
                onChange={handleChange}
              >
                <option value='F'>여</option>
                <option value='M'>남</option>
                <option value='N'>밝히고 싶지않음</option>
              </select>
            </label>
            <button onClick={userModify} className='update-button'>
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
