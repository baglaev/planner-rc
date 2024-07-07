import { useState } from 'react';
import './CreateEvent.css';
import '../../components/PopupEvent/PopupEvent.css';
import avatarRc from '../../images/avatar-rc.png';

function CreateEvent({ onAddPlace, onClose, isOpen }) {
    const [formValue, setFormValue] = useState({
        title: '',
        description: '',
        location: '',
        dateStart: '',
        dateEnd: '',
        time: ''
    });

    const [files, setFiles] = useState([]);

    function handleSubmit(e) {
        e.preventDefault();
        const { title, description, location, dateStart, dateEnd, time } = formValue;
        const datetimeStart = `${dateStart}T${time}:00`;
        const datetimeEnd = dateEnd ? `${dateEnd}T${time}:00` : '';

        onAddPlace({
            ...formValue,
            dateStart: datetimeStart,
            dateEnd: datetimeEnd,
            files
        });
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    }

    function handleFileChange(e) {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    }

    return (
        <div className={`event ${isOpen ? 'event_opened' : ''}`}>
            <div className="event__section">
                <button className="event__close-button" onClick={onClose}></button>
                <h2 className="event__title">Создание события</h2>
                <form onSubmit={handleSubmit} className="event__form">
                    <div className="event__form-flex">
                        <div className="event__f-column">
                            <input type="text" name="title" onChange={handleChange} className="event__input" placeholder="Название" required />
                            <input type="text" name="description" onChange={handleChange} className="event__input" placeholder="Описание" required />
                            <input type="text" name="users" onChange={handleChange} className="event__input" placeholder="Участники" />
                            <input
                                type="file"
                                name="file"
                                className="event__input-file"
                                onChange={handleFileChange}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                id="fileInput"
                                multiple
                            />
                            <label
                                htmlFor="fileInput"
                                className="event__input-file-label"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                {files.length > 0 ? files.map(file => file.name).join(', ') : 'Выберите фото или перетащите сюда'}
                            </label>
                        </div>
                        <div className="event__s-column">
                            <div className="event__date-container">
                                <input type="date" name="dateStart" onChange={handleChange} className="event__input-date" placeholder="Начало" required />
                                <input type="date" name="dateEnd" onChange={handleChange} className="event__input-date" placeholder="Конец" />
                            </div>
                            <input type="time" name="time" onChange={handleChange} className="event__input" placeholder="Время" required />
                            <input type="text" name="location" onChange={handleChange} className="event__input" placeholder="Место проведения" required />
                            <div className="popup__participant-info">
                                <img src={avatarRc} alt="" className="popup__avatar" />
                                <div className="popup__participant-about">
                                    <p className="participant__name">Илья</p>
                                    <span className="participant__job">Организатор</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="event__submit-button submit-button_active">Создать</button>
                </form>
            </div>
        </div>
    );
}

export default CreateEvent;
