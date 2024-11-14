import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import SideBar from '../components/SideBar';
import SideBar from './sideBar';
import Calendar from './Calendar';
import Todo from './Todo';
import Diary from './Diary';
import '../css/Main.css';
export default function Main(){
    const navigate = useNavigate('');
    const [userId, setuserId] = useState();
    const [userName, setuserName] = useState('');
    const [userImg, setuserImg] = useState('');

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');
        if (storedUserId) {
            setuserId(storedUserId);
            setuserName(sessionStorage.getItem('userName') || '');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const date=new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const today = year + '-' + month  + '-' + day;

    return(
        <>
        <div className='Main'>
            <SideBar className='SideBar section' user={userId}></SideBar>
            <div id='first' className='knot'>
            <Calendar id='Calendar' today={today} user={userId} className='Calendar section'></Calendar>
            </div>
            <div id='second' className='knot'>
                <Diary id='Diary' today={today} user={userId} className='Diary section'></Diary>
            </div>
        </div>
        </>
    )
};
