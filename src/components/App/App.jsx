import { useState, useEffect, useCallback } from 'react';
import './App.css';
import Calendar from '../Calendar/Calendar';
import Header from '../Header/Header';
import PopupEvent from '../PopupEvent/PopupEvent';
import Login from '../Login/Login';
import NavBar from '../NavBar/NavBar';
import CreateEvent from '../CreateEvent/CreateEvent';
import QuestionPopup from '../QuestionPopup/QuestionPopup';
import PopupCongratulation from '../PopupCongratulation/PopupCongratulation';
import PopupConfirmedEvent from '../PopupConfirmedEvent/PopupConfirmedEvent';
import { getContent, addEvent, getEvents, uploadFiles } from '../../utils/api';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [events, setEvents] = useState([]);
  const [isCreateEventPopupOpen, setIsCreateEventPopupOpen] = useState(false);
  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCongratulationPopupOpen, setIsCongratulationPopupOpen] = useState(false);
  const [isConfirmedPopup, setIsConfirmedPopup] = useState(false);
  const [isQuestionPopupOpen, setIsQuestionPopupOpen] = useState(false);
  const [isEventPopupOpen, setIsEventPopupOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  async function checkToken() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      try {
        const data = await getContent(jwt);
        if (data) {
          setUserData(data);
          setLoggedIn(true);
        }
      } catch (err) {
        setLoggedIn(false);
        console.error(`Ошибка проверки токена: ${err}`);
      }
    }
  }

  useEffect(() => {
    checkToken();
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const events = await getEvents();
      setEvents(events);
    } catch (err) {
      console.error(`Ошибка получения событий: ${err}`);
    }
  }

  async function handleAddPlaceSubmit(item) {
    try {
      const fileMetadata = await uploadFiles(item.files);
      const res = await addEvent(item.title, item.description, item.location, item.dateStart, item.dateEnd, item.time, fileMetadata);
      setEvents([res, ...events]);
      setClosedAllPopup();
      handleCongratulationPopup(res);
    } catch (err) {
      console.error(`Ошибка добавления события: ${err}`);
    }
  }

  const setClosedAllPopup = useCallback(() => {
    setIsCreateEventPopupOpen(false);
    setIsEventPopupOpen(false);
    setIsCongratulationPopupOpen(false);
    setLoginPopupOpen(false);
    setIsQuestionPopupOpen(false);
    setIsConfirmedPopup(false);
    setSelectedEvent(null);
  }, []);

  function closedQuestionPopup() {
    setIsQuestionPopupOpen(false);
  }

  function handleQuestionPopup() {
    setIsQuestionPopupOpen(true);
  }

  const closeAllPopups = useCallback(() => {
    setClosedAllPopup();
  }, [setClosedAllPopup]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  function handleLoginPopup() {
    setLoginPopupOpen(true);
  }

  function handleCreateEventPopup() {
    setIsCreateEventPopupOpen(true);
  }

  function handleCongratulationPopup(createdEvent) {
    setSelectedEvent(createdEvent);
    setIsCongratulationPopupOpen(true);
  }

  function handleConfirmedPopup() {
    setIsConfirmedPopup(true);
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventPopupOpen(true);

    const updatedEvent = { ...event, hasJoined: true };
    updateEventParticipants(event.id, userData.id, updatedEvent);
  };

  function updateEventParticipants(eventId, userId, updatedEvent) {
    setEvents((prevEvents) => {
      return prevEvents.map((event) => {
        if (event.id === eventId) {
          return updatedEvent;
        }
        return event;
      });
    });
  }

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        loginPopup={handleLoginPopup}
        currentDate={currentDate}
        handleCreateEventPopup={handleCreateEventPopup}
      />
      <Calendar
        currentDate={currentDate}
        events={events}
        onEventClick={handleEventClick}
      />
      {selectedEvent && (
        <PopupEvent
          event={selectedEvent}
          onClose={closeAllPopups}
          isOpen={isEventPopupOpen}
          isLoggedIn={isLoggedIn}
          userId={userData.id}
          updateEventParticipants={updateEventParticipants}
          handleLoginPopup={handleLoginPopup}
        />
      )}
      <PopupCongratulation
        onClose={closeAllPopups}
        isOpen={isCongratulationPopupOpen}
        selectedEvent={selectedEvent}
      />
      <QuestionPopup onClose={closedQuestionPopup} isOpen={isQuestionPopupOpen} onCloseAll={closeAllPopups} />
      <NavBar setLoggedIn={setLoggedIn} />
      <Login handleLogin={() => setLoggedIn(true)} isOpen={isLoginPopupOpen} onClose={closeAllPopups} />
      <CreateEvent onAddPlace={handleAddPlaceSubmit} onClose={handleQuestionPopup} isOpen={isCreateEventPopupOpen} />
    </>
  );
}

export default App;
