import {useState} from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import BackButton from '../reusable/BackButton';

import Popup from 'react-popup';

import { PopUp, PopUpQueue } from '../reusable/PopUp';

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

        if(username === '' || password === '' || confirmPassword === '' || email === '') {
            console.log('please enter details');
            setGenericError('Some or all the required fields are empty');
            return;
        }

        //if there's any non-word character(anything except [a-zA-Z0-9_]), username is invalid
        //if username starts with a digit like 3hamza, it is invalid
        const usernameRegex = /^[^\d][\w]+$/;
        if(!usernameRegex.test(username)) {
            console.log('username must only consist of, lowercase characters; uppercase characters; digits; underscores and must not start with a digit');
            setUsernameError('Invalid username');
            return;
        }
        
        const passwordRegex = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*]).*$/;
        if(!passwordRegex.test(password)) {
            console.log('password must contain at least one lowercase, one uppercase and one symbol');
            setPasswordError('Invalid password');
            return;
        }

        if(password !== confirmPassword) {
            console.log('passwords do not match');
            setConfirmPasswordError('Passwords don\'t match');
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if(!emailRegex.test(email)) {
            console.log('invalid email');
            setEmailError('Invalid email');
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
        <>
            <BackButton />
            
            {
                genericError &&
                <h4>{genericError}</h4>
            }

            <form onSubmit = {handleSignUp} style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                <input type = 'text' placeholder = 'username' value = {username} onChange = {handleUsername} />
                {
                    usernameError &&
                    <span>{usernameError}</span>
                }

                <input type = 'password' placeholder = 'password' value = {password} onChange = {handlePassword} />
                {
                    passwordError &&
                    <span>{passwordError}</span>
                }

                <input type = 'password' placeholder = 'confirm password' value = {confirmPassword} onChange = {handleConfirmPassword} />
                {
                    confirmPasswordError &&
                    <span>{confirmPasswordError}</span>
                }

                <input type = 'text' placeholder = 'email' value = {email} onChange = {handleEmail} />
                {
                    emailError &&
                    <span>{emailError}</span>
                }

                <textarea placeholder = 'write something about yourself' value = {about} onChange = {handleAbout} />

                <input type = 'submit' value = 'Sign up' />
            </form>

            <Popup />
        </>
    );
}

export default SignUp;