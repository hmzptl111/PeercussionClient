import {useState} from 'react';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";

import BackButton from '../reusable/BackButton';

import Popup from 'react-popup';

import { PopUp, PopUpQueue } from '../reusable/PopUp';

import InfoButton from '../reusable/InfoButton';

import Logo from '../header/Logo';
import '../../styles/auth/Auth.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [about, setAbout] = useState('');
    let history = useHistory();

    const [genericError, setGenericError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [aboutError, setAboutError] = useState('');

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
        if(!usernameRegex.test(username)) {
            setUsernameError('invalid username');
            return;
        }
        
        const passwordRegex = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*]).*$/;
        if(!passwordRegex.test(password)) {
            console.log('password must contain at least one lowercase, one uppercase and one symbol');
            setPasswordError('invalid password');
            return;
        }

        if(password !== confirmPassword) {
            setConfirmPasswordError('passwords do not match');
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if(!emailRegex.test(email)) {
            setEmailError('invalid email');
            return;
        }

        if(about.length > 100) {
            setAboutError('invalid about');
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
        console.log(result.data);

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


    return (
        <div className = 'container'>
            
            <div className = 'container-auth'>
                <form onSubmit = {handleSignUp} className = 'auth-card'>
                    <BackButton />
                    

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
                            <InfoButton content = 'Username must only consist of the english alphabet (a - z  A - Z) or underscore ( _ )' />
                        </span>
                    </div>


                    {
                        passwordError &&
                        <span className = 'specific-error'>{passwordError}</span>
                    }
                    <div className = 'auth-card-item'>
                        <input type = 'password' placeholder = 'Password' value = {password} onChange = {handlePassword} className = 'auth-card-item-input' />
                        <span className = 'auth-card-item-info'>
                            <InfoButton content = 'Password must consist of at least one lowercase (a - z), one uppercase (A - Z) and one special character (~ ! @ # $ % ^ & *)' />
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
                            <InfoButton content = 'An email will be sent to your account for confirmation, make sure you have access to it' />
                        </span>
                    </div>


                    {
                        aboutError &&
                        <span className = 'specific-error'>{aboutError}</span>
                    }
                    <div className = 'auth-card-item'>
                        <textarea placeholder = 'About you' value = {about} onChange = {handleAbout} className = 'auth-card-item-input auth-card-item-about' />
                        <span className = 'auth-card-item-info'>
                            <InfoButton content = 'Must not exceed 100 characters' />
                        </span>
                    </div>


                    <div className = 'auth-footer'>
                        <Link to = '/signin' className = 'auth-footer-sign-in'>Sign in</Link>

                        <input type = 'submit' value = 'Sign up' className = 'auth-footer-submit' />
                    </div>
                </form>
            </div>

            <Popup />
        </div>
    );
}

export default SignUp;