import React, { useState, useEffect } from 'react';
import SideBar from './sideBar';
import '../css/mypage.css';

export default function MyPage(){
    const user = sessionStorage.getItem('userId');
    const [userName, setUserName] = useState('');
    const [userImg, setUserImg] = useState('');
    const [userMsg, setUserMsg] = useState('');
    const [userEmail, setuserEmail] =useState('');
    const [userBirth, setuserBirth] =useState('');
    const [userGender, setuserGender] =useState('');


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
                setuserEmail(data.userEmail);
                setuserGender(data.userGender);
                setuserBirth(data.userBirth);
            }
        })
        .catch(error => console.error('세션 정보 가져오기 오류:', error));
    }, [user]); // user가 변경될 때마다 실행

      const handleChange = (e) => {
        // const { name, value } = e.target;
        // setFormData((prevData) => ({
        //   ...prevData,
        //   [name]: value,
        // }));
      };
    
      const handleUpdate = () => {
        console.log('Profile updated with:');
      };
    
    return (
        <div className='myPage'>
            <SideBar user={user}></SideBar>
            <div className="profile-container">
                <div className='myPageMain'>
                    <div className="profile-header">
                        <h1 className='profile'>프로필</h1>
                        <img className='userImg' src={userImg} alt="없음" />
                        <input type="text" value={userName} className="userName" name="userName" disabled />
                        <input type="text" value={userMsg} className="userMsg" disabled/>
                        {/* <button className="edit-status-button">수정하기</button> */}
                    </div>
                    <div className="profile-form">
                        <label>
                        사용자 ID: <input type="text" value={user} name="userId" disabled />
                        </label>
                        <label>
                        이메일:
                        <input type="email" value={userEmail} name="email" onChange={handleChange}/>
                        </label>
                        <label>
                        생년월일:
                        <input type="text" value={userBirth} name="birthday" onChange={handleChange}/>
                        </label>
                        {/* <label>
                        비밀번호:
                        <input type="password" value={formData.password} name="password" onChange={handleChange}/>
                        </label>
                        <label>
                        비밀번호 확인:
                        <input type="password" value={formData.confirmPassword} name="confirmPassword" onChange={handleChange}/>
                        </label> */}
                        <label>
                        성별:
                        <input type="text" value={userGender} name="gender" disabled />
                        </label>
                    </div>
                </div>
            {/* <button onClick={handleUpdate} className="update-button">수정하기</button>    
            <button className="logout-button">회원 탈퇴</button> */}
            </div>
        </div>
      );
};