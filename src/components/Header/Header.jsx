import './Header.css'
import headerLogo from '../../images/logo-rc.svg'

function Header({ isLoggedIn, handlePrevMonth, handleNextMonth, loginPopup, currentDate, handleCreateEventPopup }) {
    const currentYear = new Date().getFullYear();
    const title = currentDate.getFullYear() === currentYear
        ? currentDate.toLocaleDateString('ru-RU', { month: 'long' })
        : currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });


    return (
        <header className="header">
            <div className="header__left-column">
                <div className="header__logo">
                    <img src={headerLogo} alt="" className="header__logo-img" />
                    red collar
                </div>
                <h1 className="header__title">planner <span className="header__span">event</span></h1>
            </div>
            <div className="header__right-column">
                <div className="header__calendar-buttons">
                    <p className="header__calendar-month">
                        {title}
                    </p>
                    <button className="header__calendar-button" onClick={handlePrevMonth}></button>
                    <button className="header__calendar-button button_next" onClick={handleNextMonth}></button>
                </div>
                {isLoggedIn ? (
                    <div className="header__profile-section">
                        <button className="header__add-button" onClick={handleCreateEventPopup}></button>
                        <button className="header__profile"></button>
                    </div>

                ) : (
                    <a className="header__link" onClick={loginPopup}>Войти</a>
                )}

            </div>
        </header>
    );
}

export default Header;