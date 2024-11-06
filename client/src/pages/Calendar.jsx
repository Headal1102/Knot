import React, { useState } from 'react';
import '../css/Calendar.css';

export default function Calendar(){
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = (month, year) => {
      return new Date(year, month + 1, 0).getDate();
    };
  
    const firstDayOfMonth = (month, year) => {
      return new Date(year, month, 1).getDay();
    };
  
    const handlePrevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };
  
    const handleNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };
  
    const renderDays = () => {
      const totalDays = daysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
      const firstDayIndex = firstDayOfMonth(currentMonth.getMonth(), currentMonth.getFullYear());
      const days = [];
  
    
      for (let i = 0; i < firstDayIndex; i++) {
        days.push(<div key={`empty-${i}`} className="empty"></div>);
      }
  
      
      for (let day = 1; day <= totalDays; day++) {
        days.push(
          <div key={day} className={day === 0 ? "day selected" : "day"}>
            {day}
          </div>
        );
      }
  
      return days;
    };
    return(
        <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h3>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-body">
        <div className="week-days">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
            <div key={index} className="week-day">
              {day}
            </div>
          ))}
        </div>
        <div className="days-grid">{renderDays()}</div>
      </div>
    </div>
    )
};