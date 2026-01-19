import React, { useState } from 'react';

const CalendarWidget = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month); // 0 = Sunday

  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      
      days.push(
        <div key={d} className={`calendar-day ${dayEvents.length > 0 ? 'has-event' : ''}`}>
          <span className="day-number">{d}</span>
          {dayEvents.map((ev, idx) => (
            <div key={idx} className="event-dot" title={`${ev.time} - ${ev.title}`}></div>
          ))}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <button className="btn btn-sm btn-link text-decoration-none" onClick={prevMonth}>&lt;</button>
        <span className="fw-bold">{monthNames[month]} {year}</span>
        <button className="btn btn-sm btn-link text-decoration-none" onClick={nextMonth}>&gt;</button>
      </div>
      <div className="card-body p-2">
        <div className="calendar-grid mb-3">
          {["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"].map(d => <div key={d} className="day-name">{d}</div>)}
          {renderDays()}
        </div>
        <div className="small border-top pt-2">
            <h6 className="mb-2">📅 مواعيد هذا الشهر:</h6>
            <ul className="list-unstyled mb-0">
                {events.filter(e => new Date(e.date).getMonth() === month && new Date(e.date).getFullYear() === year).slice(0, 3).map((e, i) => (
                    <li key={i} className="text-muted mb-1 text-truncate">
                        <span className="badge bg-info text-dark me-1">{e.date.split('-')[2]}</span>
                        {e.title} <span className="text-muted ms-1">({e.time})</span>
                    </li>
                ))}
                {events.filter(e => new Date(e.date).getMonth() === month && new Date(e.date).getFullYear() === year).length === 0 && <li className="text-muted">لا توجد مواعيد</li>}
            </ul>
        </div>
      </div>
      <style>{`
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; }
        .day-name { font-weight: bold; font-size: 0.75rem; color: #666; margin-bottom: 4px; }
        .calendar-day { border: 1px solid #f0f0f0; border-radius: 4px; min-height: 35px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
        .calendar-day:hover { background-color: #f8f9fa; }
        .day-number { font-size: 0.85rem; }
        .has-event { background-color: #e8f4ff; border-color: #b6d4fe; font-weight:bold; }
        .event-dot { width: 5px; height: 5px; background-color: #0d6efd; border-radius: 50%; margin-top: 2px; }
      `}</style>
    </div>
  );
};

export default CalendarWidget;