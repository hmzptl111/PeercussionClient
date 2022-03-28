import {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';

import Logo from '../header/Logo';

import InfoButton from '../reusable/InfoButton';

import Popup from 'react-popup';
import { PopUp, PopUpQueue } from '../reusable/PopUp';

import axios from 'axios';

const ResetPassword = () => {
    const {token} = useParams();
    const [newPassword, setNewPassword] = useState('');

    const [passwordError, setPasswordError] = useState('');

    let history = useHistory();

    const handleNewPassword = (e) => {
        setNewPassword(e.target.value);
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();

        setPasswordError('');

        const passwordRegex = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*]).*$/;
        if(newPassword.length > 64 || !passwordRegex.test(newPassword)) {
            setPasswordError('Invalid password, click on the (i) icon to follow the accepted format');
            return;
        }

        const payload = {
            newPassword: newPassword
        }

        // const result = await axios.post(`http://localhost:3001/resetPassword/${token}`, payload);
        const result = await axios.post(`/resetPassword/${token}`, payload);
        if(result.data.message) {
            history.replace('/signin', {from: 'ResetPassword', message: result.data.message});
            return;
        } else {
            const errorPopup = PopUp('Something went wrong', result.data.error);
            PopUpQueue(errorPopup);
        }
    }

    return <div className = 'container'>
        <div className = 'container-auth'>
            <form onSubmit = {handleResetPassword} className = 'auth-card'>
                <div className = 'auth-card-header'>
                    <div className = 'auth-card-header-logo'>
                        <Logo />
                    </div>
                    <div className = 'auth-card-header-text'>
                        Reset password
                    </div>
                </div>

                {
                    passwordError &&
                    <span className = 'specific-error'>{passwordError}</span>
                }
                <div className = 'auth-card-item'>
                    <input type = 'password' placeholder = 'New Password' value = {newPassword} onChange = {handleNewPassword} className = 'auth-card-item-input' />
                    <span className = 'auth-card-item-info'>
                        <InfoButton content = 'Password should consist of at least one lowercase (a - z), one uppercase (A - Z) and one special character (~ ! @ # $ % ^ & *). It should consist of at least 8 characters and should not exceed 64 characters' />
                    </span>
                </div>

                <div className = 'auth-footer-right-aligned-submit'>
                    <input type = 'submit' value = 'Reset Password' className = 'auth-footer-submit' />
                </div>
            </form>
        </div>

        <Popup />
    </div>
}

export default ResetPassword;