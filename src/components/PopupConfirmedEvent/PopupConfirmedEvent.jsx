import './PopupConfirmedEvent.css';

function PopupConfirmedEvent({ onClose, isOpen, selectedEvent }) {
    if (!selectedEvent) {
        return null;
    }

    const dayOfWeek = new Date(selectedEvent.dateStart).toLocaleDateString('ru-RU', { weekday: 'long' });

    const formattedDate = new Date(selectedEvent.dateStart).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
    });

    const formattedTime = new Date(selectedEvent.dateStart).toLocaleTimeString('ru-RU', {
        hour: 'numeric',
        minute: 'numeric'
    });

    return (
        <div className={`popup-cof ${isOpen ? 'popup-cof_active' : ''}`}>
            <div className="popup-cof_section">
                <button className="popup-cof__button-close" onClick={onClose}></button>
                <h3 className="popup-cof__title">Поздравляем! </h3>
                <p className="popup-cof__subtitle">Вы теперь участник события: <span className="popup-cof__span">{selectedEvent.title}</span></p>
                <div className="popup-cof__flex">
                    <p className="popup-cof__item item_first">{dayOfWeek}</p>
                    <p className="popup-cof__item item_border">{formattedDate}</p>
                    <p className="popup-cof__item">{formattedTime}</p>
                </div>
                <p className="popup-cof__location">{selectedEvent.location}</p>
                <button className="popup-cof__button" onClick={onClose}>Отлично</button>
            </div>
        </div>
    );
}

export default PopupConfirmedEvent;
