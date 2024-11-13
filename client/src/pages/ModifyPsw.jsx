import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ModifyPsw.css';
export default function ModifyPsw(){
    const userId=sessionStorage.getItem('userId');
    const userEmail=sessionStorage.getItem('userEmail');
    const navigate = useNavigate();
    const [newUserPsw, setnewUserPsw] = useState('');
    const [newUserPswTest, setnewUserPswTest] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData={
            userId:userId,
            userEmail:userEmail,
            userPsw:newUserPsw,
        }
        if (newUserPsw!==newUserPswTest) {
            return alert('비밀번호가 일치하지 않습니다.');
        }
        const userModify = async () => {
            try {
              const response = await fetch('http://localhost:8080/api/find/psw/modify', {
                method: 'PUT',  // 수정할 때는 'POST'로 변경
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
              });
        
              if (response.ok) {
                alert('비밀번호 변경 완료.');
                navigate('/');
              } else {
                alert('비밀번호 변경 실패.');
              }
            } catch (error) {
              console.error('Error:', error);
              alert('네트워크 오류가 발생했습니다.');
            }
          };
          await userModify();
      };
    return(
        <form onSubmit={handleSubmit} action="">
            <div id='ModifyPswBox'>
                <h2  onClick={() => { navigate('/');}}>KNOT</h2>
                <h3>비밀번호 변경</h3>
                <input onChange={(e) => setnewUserPsw(e.target.value)} name="newUserPsw" type="password" placeholder="변경할 새로운 비밀번호" required/>
                <input onChange={(e) => setnewUserPswTest(e.target.value)} name="newUserPswTest" type="password" placeholder="새로운 비밀번호 재입력" required/>
                <button type="submit">
                    비밀번호 변경하기
                </button>
                <div id='links'>
                <span onClick={() => { navigate('/FindId');}}>아이디 찾기</span>
                <span>|</span>
                <span onClick={() => { navigate('/Login');}}>로그인</span>
                </div>
            </div>
        </form>
    );
}