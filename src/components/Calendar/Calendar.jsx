import './Calendar.css';

function Calendar({ currentDate, events, onEventClick }) {
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const startDay = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1;
    const daysInMonth = endOfMonth.getDate();

    const days = [];
    const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

    for (let i = startDay; i > 0; i--) {
        days.push(`prev-${prevMonthEnd - i + 1}`);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const totalCells = days.length;
    const remainingCells = (42 - totalCells) % 42;
    for (let i = 1; i <= remainingCells; i++) {
        days.push(`next-${i}`);
    }

    const isSameDate = (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    return (
        <div className="calendar">
            <div className="calendar__header">
            </div>
            <div className="calendar__grid">
                <div className="calendar__days">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="calendar__day-header">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="calendar__section">
                    {days.map((day, index) => {
                        const isPrevMonth = typeof day === 'string' && day.startsWith('prev-');
                        const isNextMonth = typeof day === 'string' && day.startsWith('next-');
                        const dayNumber = isPrevMonth || isNextMonth ? parseInt(day.replace(/^(prev-|next-)/, ''), 10) : day;
                        const currentDateForDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + (isPrevMonth ? -1 : isNextMonth ? 1 : 0), dayNumber);

                        const dayEvents = events.filter(event => isSameDate(new Date(event.dateStart), currentDateForDay));

                        return (
                            <div
                                key={index}
                                className={`calendar__day ${isPrevMonth ? 'prev-month-day' : ''} ${isNextMonth ? 'next-month-day' : ''}`}
                            >
                                {dayNumber}
                                <div className="calendar__events">
                                    {/* {dayEvents.map(event => (
                                        <div
                                            key={event.id}
                                            className="calendar__event"
                                            onClick={() => onEventClick(event)}
                                        >
                                            {event.title}
                                        </div>
                                    ))} */}
                                    {dayEvents.map(event => (
                                        <div
                                            key={event.id}
                                            className={`calendar__event ${event.hasJoined ? 'calendar__event_active' : ''} ${new Date(event.dateStart) < new Date() ? 'calendar__event_passed' : ''}`}
                                            onClick={() => onEventClick(event)}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Calendar;
