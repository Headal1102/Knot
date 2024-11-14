import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from './sideBar';
import '../css/mypage.css';

export default function MyPage(){
    const navigate = useNavigate();

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
                const localDate = new Date(new Date(data.userBirth).getTime() + (9 * 60 * 60 * 1000));
                setuserBirth(localDate.toISOString().split('T')[0]); // YYYY-MM-DD 형식으로 설정
            }
        })
        .catch(error => console.error('세션 정보 가져오기 오류:', error));
    }, [user]); // user가 변경될 때마다 실행

    const userBye = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/mypage/bye', {
            method: 'Delete',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: { userId: `${user}` } }),
          });
    
          if (response.ok) {
            const data= await response.json();
            alert('회원 탈퇴 완료. 다음에 다시 만나요.');
            delete sessionStorage.userId;
            navigate('/');
          } else {
            alert('회원 탈퇴 실패 다시 시도해 주세요');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('네트워크 오류가 발생했습니다.');
        }
      };
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

      const navtoModify = () => {
        navigate("/mypage/modify");
      }
    
    return (
        <div className='myPage'>
            <SideBar user={user}></SideBar>
            <div className="profile-container">
                <div className='myPageMain'>
                    <div className="profile-header">
                        <h1 className='profile'>프로필</h1>
                        <img className='userImg' src={userImg} alt="" />
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
                        <input type="text" value={userBirth.substring(0,10)} name="birthday" onChange={handleChange}/>
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
                        <button className="update-button" onClick={navtoModify}>수정하기</button>
                        <button className="logout-button" onClick={userBye}>회원 탈퇴</button>
                    </div>
                </div>
            </div>
        </div>
      );
};