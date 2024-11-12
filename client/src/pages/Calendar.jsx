import React, { useState } from 'react';
import '../css/Calendar.css';

export default function Calendar(){
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const koreaTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const today = koreaTime.getDate();
  const currentKoreanMonth = koreaTime.getMonth();
  const currentKoreanYear = koreaTime.getFullYear();

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDay(null); 
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDay(null); 
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const renderDays = () => {
    const totalDays = daysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const firstDayIndex = firstDayOfMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === today &&
        currentMonth.getMonth() === currentKoreanMonth &&
        currentMonth.getFullYear() === currentKoreanYear;
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
    </div>
  );
};