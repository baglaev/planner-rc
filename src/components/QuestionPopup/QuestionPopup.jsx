import './QuestionPopup.css'

function QuestionPopup({ onClose, isOpen, onCloseAll }) {
    return (
        <div className={`popup-question ${isOpen ? 'popup-question_opened' : ''}`}>
            <div className="popup-question__section">
                <button className="popup-question__close-button" onClick={onClose}></button>
                <h2 className="popup-question__title">Передумали создавать событие?</h2>
                <div className="popup-question__buttons">
                    <button className="popup-question__button" onClick={onClose}>Нет</button>
                    <button className="popup-question__button button_yes" onClick={onCloseAll}>Да</button>
                </div>
            </div>
        </div >
    )
}

export default QuestionPopup;