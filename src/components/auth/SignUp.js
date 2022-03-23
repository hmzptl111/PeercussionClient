import '../../styles/auth/Auth.css';

import { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import axios from 'axios';

import Logo from '../header/Logo';
import InfoButton from '../reusable/InfoButton';

import { PopUp, PopUpQueue } from '../reusable/PopUp';


const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [about, setAbout] = useState('');

    const [genericError, setGenericError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [aboutError, setAboutError] = useState('');
    
    const {isUserSignedIn} = useContext(UserAuthStatusContext);

    let history = useHistory();

    
    useEffect(() => {
        if(isUserSignedIn) {
            history.replace('/');
        }
        //eslint-disable-next-line
    }, [isUserSignedIn]);

    const handleUsername = e => {
        setUsername(e.target.value);
    }
    
    const handlePassword = e => {
        setPassword(e.target.value);
    }
    
    const handleConfirmPassword = e => {
        setConfirmPassword(e.target.value);
    }
    
    const handleEmail = e => {
        setEmail(e.target.value);
    }

    const handleAbout = e => {
        setAbout(e.target.value);
    }
    
    const handleSignUp = async (e) => {
        e.preventDefault();

        setGenericError('');
        setUsernameError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setEmailError('');
        setAboutError('');

        if(username === '' || password === '' || confirmPassword === '' || email === '') {
            setGenericError('Some or all of the required fields are empty');
            return;
        }

        //if there's any non-word character(anything except [a-zA-Z0-9_]), username is invalid
        //if username starts with a digit like 3hamza, it is invalid
        const usernameRegex = /^[^\d][\w]+$/;
        if(username.length > 32 || !usernameRegex.test(username)) {
            setUsernameError('Invalid username, click on the (i) icon to follow the accepted format');
            return;
        }
        
        const passwordRegex = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*]).*$/;
        if(password.length > 64 || !passwordRegex.test(password)) {
            setPasswordError('Invalid password, click on the (i) icon to follow the accepted format');
            return;
        }

        if(password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if(email.length > 320 || !emailRegex.test(email)) {
            setEmailError('Invalid email, click on the (i) icon to follow the accepted format');
            return;
        }

        if(about.length > 255) {
            setAboutError('Invalid about, click on the (i) icon to follow the accepted format');
            return;
        }

        const payload = {
            username: username,
            password: password,
            email: email,
            about: about
        }

        const result = await axios.post('/signUp', payload);
        
        if(result.data.error) {
            const errorPopup = PopUp('Something went wrong', result.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setAbout('');
        
        console.log('signed in successfully');

        if(result.status === 200) {
            history.push("/signin", {from: 'SignUp', message: result.data.message});
        }
    }


    return <div className = 'container'>
    <div className = 'container-auth'>
        <form onSubmit = {handleSignUp} className = 'auth-card'>
            <div className = 'auth-card-header'>
                <div className = 'auth-card-header-logo'>
                    <Logo />
                </div>
                <div className = 'auth-card-header-text'>
                    Create an account
                </div>
            </div>

            {
                genericError &&
                <h5 className = 'generic-error'>{genericError}</h5>
            }

            {
                usernameError &&
                <span className = 'specific-error'>{usernameError}</span>
            }
            <div className = 'auth-card-item'>
                <input type = 'text' placeholder = 'Username' value = {username} onChange = {handleUsername} className = 'auth-card-item-input' />
                <span className = 'auth-card-item-info'>
                    <InfoButton content = 'Username should only consist of the english alphabet (a - z  A - Z) and underscore ( _ ), and should not exceed 32 characters' />
                </span>
            </div>

            {
                passwordError &&
                <span className = 'specific-error'>{passwordError}</span>
            }
            <div className = 'auth-card-item'>
                <input type = 'password' placeholder = 'Password' value = {password} onChange = {handlePassword} className = 'auth-card-item-input' />
                <span className = 'auth-card-item-info'>
                    <InfoButton content = 'Password should consist of at least one lowercase (a - z), one uppercase (A - Z) and one special character (~ ! @ # $ % ^ & *). It should consist of at least 8 characters and should not exceed 64 characters' />
                </span>
            </div>

            {
                confirmPasswordError &&
                <span className = 'specific-error'>{confirmPasswordError}</span>
            }
            <div className = 'auth-card-item'>
                <input type = 'password' placeholder = 'Confirm password' value = {confirmPassword} onChange = {handleConfirmPassword} className = 'auth-card-item-input' />
                <span className = 'auth-card-item-info'>
                    <InfoButton content = 'Passwords must match' />
                </span>
            </div>

            {
                emailError &&
                <span className = 'specific-error'>{emailError}</span>
            }
            <div className = 'auth-card-item'>
                <input type = 'text' placeholder = 'Email' value = {email} onChange = {handleEmail} className = 'auth-card-item-input' />
                <span className = 'auth-card-item-info'>
                    <InfoButton content = 'An email will be sent to your account for confirmation, make sure it is valid and you have access to it' />
                </span>
            </div>

            {
                aboutError &&
                <span className = 'specific-error'>{aboutError}</span>
            }
            <div className = 'auth-card-item'>
                <textarea placeholder = 'About you' value = {about} onChange = {handleAbout} className = 'auth-card-item-input auth-card-item-about' />
                <span className = 'auth-card-item-info'>
                    <InfoButton content = 'Write about yourself in under 255 characters' />
                </span>
            </div>


            <div className = 'auth-footer'>
                <Link to = '/signin' className = 'auth-footer-sign-in'>Sign in</Link>

                <input type = 'submit' value = 'Sign up' className = 'auth-footer-submit' />
            </div>
        </form>
    </div>
</div>
}

export default SignUp;