import {useState} from 'react';

import Logo from '../header/Logo';

import Popup from 'react-popup';
import { PopUp, PopUpQueue } from '../reusable/PopUp';

import axios from 'axios';


const ForgotPassword = () => {
    const [username, setUsername] = useState('');

    const [genericError, setGenericError] = useState('');
    const [usernameError, setUsernameError] = useState('');

    
    const handleUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        setGenericError('');
        setUsernameError('');

        if(username === '') {
            setGenericError('Some or all of the required fields are empty');
            return;
        }

        const payload = {
            username: username
        }

        const result = await axios.post('/forgotPassword', payload);
        if(result.data.message) {
            const emailPopup = PopUp('Update', result.data.message);
            PopUpQueue(emailPopup);
        } else {
            const errorPopup = PopUp('Something went wrong', result.data.error);
            PopUpQueue(errorPopup);
        }
    }

    return <div className = 'container'>
    <div className = 'container-auth'>
        <form onSubmit = {handleForgotPassword} className = 'auth-card'>
            <div className = 'auth-card-header'>
                <div className = 'auth-card-header-logo'>
                    <Logo />
                </div>
                <div className = 'auth-card-header-text'>
                    Forgot password
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
                <input type = 'text' placeholder = 'Username or Email' value = {username} onChange = {handleUsername} className = 'auth-card-item-input' />
            </div>

            <div className = 'auth-footer-right-aligned-submit'>
                <input type = 'submit' value = 'Reset Password' className = 'auth-footer-submit' />
            </div>
        </form>
    </div>

    <Popup />
</div>
}

export default ForgotPassword;