import React, { useState, useEffect } from 'react';
import './PopupEvent.css';
import rcAvatar from '../../images/avatar-rc.png';
import { joinEvent, outEvent } from '../../utils/api';

function PopupEvent({ event, onClose, isOpen, isLoggedIn, userId, handleLoginPopup }) {
    const [userHasJoined, setUserHasJoined] = useState(false);
    const [eventHasPassed, setEventHasPassed] = useState(false);

    useEffect(() => {
        if (event && event.participants) {
            const hasJoined = event.participants.some(participant => participant.id === userId);
            setUserHasJoined(hasJoined);
        }

        if (event) {
            const eventDate = new Date(event.dateStart);
            const now = new Date();
            setEventHasPassed(eventDate < now);
        }
    }, [event, userId]);

    const handleJoinEvent = async () => {
        try {
            await joinEvent(event.id);
            setUserHasJoined(true);
        } catch (error) {
            console.error('Ошибка присоединения к событию:', error);
        }
    };

    const handleCancelParticipation = async () => {
        try {
            await outEvent(event.id);
            setUserHasJoined(false);
        } catch (error) {
            console.error('Ошибка отмены участия в событии:', error);
        }
    };

    if (!event) return null;

    const { title, description, location, dateStart, participants = [], photos = [] } = event;
    const dayOfWeek = new Date(dateStart).toLocaleDateString('ru-RU', { weekday: 'long' });
    const formattedDate = new Date(dateStart).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    const formattedTime = new Date(dateStart).toLocaleTimeString('ru-RU', { hour: 'numeric', minute: 'numeric' });

    return (
        <dialog className={`popup ${isOpen ? 'popup_opened' : ''}`}>
            <div className="popup__section">
                <button className="popup__close-button" onClick={onClose}></button>
                <h2 className="popup__title">{title}</h2>
                <div className="popup__description-section">
                    <div className="popup__date">
                        <div className="popup__timing">
                            <p className="popup__timing-item">{dayOfWeek}</p>
                            <p className="popup__timing-item">{formattedDate}</p>
                            <p className="popup__timing-item">{formattedTime}</p>
                        </div>
                        <p className="popup__adress">{location}</p>
                    </div>
                    <p className="popup__description">{description}</p>
                </div>
                <p className="popup__participant">Участники</p>
                <div className="popup__participant-items">
                    {participants.length > 0 ? (
                        participants.map((participant, index) => (
                            <div key={index} className="popup__participant-info">
                                <img src={participant.avatar || rcAvatar} alt="" className="popup__avatar" />
                                <div className="popup__participant-about">
                                    <p className="participant__name">{participant.username}</p>
                                    {participant.role && <span className="participant__job">{participant.role}</span>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="popup__participant-info">
                            <img src={rcAvatar} alt="" className="popup__avatar" />
                            <div className="popup__participant-about">
                                <p className="participant__name">Нет участников</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="popup__gallery-about">
                    <p className="popup__gallery-title">Галерея</p>
                    <div className="popup__button-items">
                        <button className="popup__gallery-slide"></button>
                        <button className="popup__gallery-slide gallery_right"></button>
                    </div>
                </div>
                <div className="popup__gallery">
                    {(photos && photos.length > 0) ? (
                        photos.map((photo, index) => (
                            <img key={index} src={`${'https://planner.rdclr.ru'}${photo.url}`} alt={`Фото ${index + 1}`} className="popup__gallery-image" />
                            // <img key={index} src={`${'http://localhost:1337'}${photo.url}`} alt={`Фото ${index + 1}`} className="popup__gallery-image" />
                        ))
                    ) : (
                        <p className="popup__connect">Фотографий нет</p>
                    )}
                </div>
                <div className="popup__connection">
                    {eventHasPassed ? (
                        null
                    ) : (
                        isLoggedIn ? (
                            userHasJoined ? (
                                <p className="popup__connect">Вы присоединились к событию. Если передумали, можете <span className="popup-connect-span" onClick={handleCancelParticipation}>отменить участие</span></p>
                            ) : (
                                <button className="popup__connect-button" onClick={handleJoinEvent}>Присоединиться к событию</button>
                            )
                        ) : (
                            <p className="popup__connect"><span className="popup-connect-span" onClick={handleLoginPopup}>Войдите</span>, чтобы присоединиться к событию</p>
                        )
                    )}
                </div>
            </div>
        </dialog>
    );
}

export default PopupEvent;
