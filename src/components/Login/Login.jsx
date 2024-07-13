import { useState } from 'react';
import { authorize, checkEmail, register } from '../../utils/api';
import './Login.css';
import { RegexEmail, RegexPassword } from '../../utils/constants';
import messageIcon from '../../images/info-icon.svg';
import eyeOpen from '../../images/eye-open.svg'
import eyeClose from '../../images/eye-close.svg'

function Login({ handleLogin, isOpen, onClose }) {
    const [formValue, setFormValue] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [emailChecked, setEmailChecked] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;

        if (name === 'email') {
            const isValid = value === '' || RegexEmail.test(value);
            setIsEmailValid(isValid);

            if (!isValid) {
                setErrorMessage(value === '' ? 'Email не может быть пустым' : 'Некорректный email');
            } else {
                setErrorMessage('');
            }
        }

        setFormValue({
            ...formValue,
            [name]: value,
        });
    }

    function validatePassword(password) {
        return RegexPassword.test(password);
    }

    async function handleLoginSubmit(e) {
        e.preventDefault();

        try {
            const data = await authorize(formValue.email, formValue.password);
            localStorage.setItem('jwt', data.jwt);
            handleLogin();
            onClose();
        } catch (err) {
            setErrorMessage('Ошибка авторизации');
            console.log(err);
        }
    }

    async function handleCheckEmail(e) {
        e.preventDefault();

        try {
            const res = await checkEmail(formValue.email);
            const userCheck = res.status;
            setEmailChecked(true);
            if (userCheck === 200 || userCheck === 204) {
                setIsRegistered(true);
            } else {
                setIsRegistered(false);
            }
        } catch (err) {
            setErrorMessage('Ошибка проверки email');
            console.log(err);
        }
    }

    async function handleRegisterSubmit(e) {
        e.preventDefault();

        if (formValue.password !== formValue.confirmPassword) {
            setErrorMessage('Пароли не совпадают');
            return;
        }

        if (!validatePassword(formValue.password)) {
            setErrorMessage('Пароль не соответствует требованиям');
            return;
        }

        try {
            await register(formValue.username, formValue.email, formValue.password);
            const data = await authorize(formValue.email, formValue.password);
            localStorage.setItem('jwt', data.jwt);
            handleLogin();
            onClose();
        } catch (err) {
            setErrorMessage('Ошибка регистрации');
            console.log(err);
        }
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    return (
        <div className={`login ${isOpen ? 'login_opened' : ''}`}>
            <div className="login__section">
                <button className="login__close-button" onClick={onClose}></button>
                <h2 className="login__title">Вход</h2>
                <form className="login__form" noValidate onSubmit={!emailChecked ? handleCheckEmail : (isRegistered ? handleLoginSubmit : handleRegisterSubmit)}>

                    {!emailChecked && (
                        <label className="login__label-input">
                            <input type="email" name="email" className="login__input" value={formValue.email} onChange={handleChange} placeholder="E-mail" required />
                            <span className={errorMessage ? 'login__error login__error_active' : 'login__error'}>{errorMessage}</span>
                        </label>
                    )}
                    {emailChecked && (
                        <>
                            {isRegistered ? (
                                <label className="login__label-input">
                                    <input type="password" name="password" className="login__input" value={formValue.password} onChange={handleChange} placeholder="Password" required />
                                    <span className={errorMessage ? 'login__error login__error_active' : 'login__error'}>{errorMessage}</span>
                                </label>
                            ) : (
                                <>
                                    <div className="login__message">
                                        <img src={messageIcon} alt="" className="login__message-icon" />
                                        В пароле используйте от 8 до 32 символов: строчные и прописные латинские буквы (A-z), цифры (0-9) и спец символы ( . , : ; ? ! * + % - &lt; &gt; @ [ ] { } / \ _ { } $ # )
                                    </div>

                                    <label className="login__label-input">
                                        <input type="text" name="username" className="login__input" value={formValue.username} onChange={handleChange} placeholder="Ваше имя" required />
                                    </label>
                                    <label className="login__label-input password-input">
                                        <img
                                            src={passwordVisible ? eyeOpen : eyeClose}
                                            className="login__eye-icon"
                                            onClick={togglePasswordVisibility}
                                        />
                                        <input type={passwordVisible ? 'text' : 'password'} name="password" className="login__input" value={formValue.password} onChange={handleChange} placeholder="Пароль" required />
                                        <span className={errorMessage ? 'login__error login__error_active' : 'login__error'}>{errorMessage}</span>
                                    </label>
                                    <label className="login__label-input password-input-confirm">
                                        <img
                                            src={passwordVisible ? eyeOpen : eyeClose}
                                            className="login__eye-icon"
                                            onClick={togglePasswordVisibility}
                                        />
                                        <input type={passwordVisible ? 'text' : 'password'} name="confirmPassword" className="login__input" value={formValue.confirmPassword} onChange={handleChange} placeholder="Повторить пароль" required />
                                        <span className={errorMessage ? 'login__error login__error_active' : 'login__error'}>{errorMessage}</span>
                                    </label>
                                </>
                            )}
                        </>
                    )}
                    <button className="login__button" type="submit" disabled={!isEmailValid}>
                        {!emailChecked ? 'Далее' : (isRegistered ? 'Войти' : 'Зарегистрироваться')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
