import React, { useState, useEffect } from 'react';
import '../css/Calendar.css';
import Todo from './Todo';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');

  const koreaTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const today = koreaTime.getDate(); //현재 일
  const currentKoreanMonth = koreaTime.getMonth();//현재 달
  const currentKoreanYear = koreaTime.getFullYear();// 현재 년도
  

  useEffect(() => {
    if (!formattedDate) {
      const todayFormatted = `${currentKoreanYear}-${String(currentKoreanMonth + 1).padStart(2, '0')}-${String(today).padStart(2, '0')}`;
      setFormattedDate(todayFormatted);
    }
  }, [currentKoreanYear, currentKoreanMonth, today, formattedDate]);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
//이전달로 넘어가기
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDay(null);
    setFormattedDate('');
  };
//다음달로 넘어가기
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDay(null);
    setFormattedDate('');
  };
//선택한 날짜를 selectedDay값에 넣음
  const handleDayClick = (day) => {
    setSelectedDay(day);
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formatted = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFormattedDate(formatted);
  };

  const renderDays = () => {
    const totalDays = daysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const firstDayIndex = firstDayOfMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const isToday = day === today && currentMonth.getMonth() === currentKoreanMonth && currentMonth.getFullYear() === currentKoreanYear;
      const isSelected = day === selectedDay;

      days.push(
        <div
          key={day}
          className={`day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-container">
      <h2 id='headerName'>Calendar</h2>
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h3>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-body">
        <div className="week-days">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div key={index} className="week-day">
              {day}
            </div>
          ))}
        </div>
        <div className="days-grid">{renderDays()}</div>
      </div>
      {formattedDate && (
        <Todo selectedDate={formattedDate} />
      )}
    </div>
  );
};