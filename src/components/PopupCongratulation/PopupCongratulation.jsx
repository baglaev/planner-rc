import './PopupCongratulation.css';

function PopupCongratulation({ onClose, isOpen, selectedEvent }) {
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
        <div className={`popup-con ${isOpen ? 'popup-con_active' : ''}`}>
            <div className="popup-con__section">
                <button className="popup-con__button-close" onClick={onClose}></button>
                <h3 className="popup-con__title">Ура!</h3>
                <p className="popup-con__subtitle">Вы добавили новое событие: <span className="popup-con__span">{selectedEvent.title}</span></p>
                <div className="popup-con__flex">
                    <p className="popup-con__item item_first">{dayOfWeek}</p>
                    <p className="popup-con__item item_border">{formattedDate}</p>
                    <p className="popup-con__item">{formattedTime}</p>
                </div>
                <p className="popup-con__location">{selectedEvent.location}</p>
                <button className="popup-con__button" onClick={onClose}>Отлично</button>
            </div>
        </div>
    );
}

export default PopupCongratulation;
