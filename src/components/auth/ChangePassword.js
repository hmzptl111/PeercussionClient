import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

import Logo from '../header/Logo';
import InfoButton from '../reusable/InfoButton';

import { PopUp, PopUpQueue } from '../reusable/PopUp';


const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [genericError, setGenericError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    let history = useHistory();

    
    const handleOldPassword = (e) => {
        setOldPassword(e.target.value);
    }

    const handleNewPassword = (e) => {
        setNewPassword(e.target.value);
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setGenericError('');
        setPasswordError('');

        const passwordRegex = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*]).*$/;
        if(newPassword.length > 64 || !passwordRegex.test(newPassword)) {
            setPasswordError('Invalid password, click on the (i) icon to follow the accepted format');
            return;
        }

        if(oldPassword === '' || newPassword === '') {
            setGenericError('Some or all of the required fields are empty');
            return;
        }

        if(oldPassword === newPassword) {
            setGenericError('New password cannot be the same as old password');
            return;
        }

        const payload = {
            oldPassword: oldPassword,
            newPassword: newPassword
        }

        const result = await axios.post('/changePassword', payload);
        if(result.data.message) {
            history.replace('/', {from: 'ChangePassword', message: result.data.message});
            return;
        } else {
            const errorPopup = PopUp('Something went wrong', result.data.error);
            PopUpQueue(errorPopup);
        }
    }

    return <div className = 'container'>
    <div className = 'container-auth'>
        <form onSubmit = {handleChangePassword} className = 'auth-card'>
            <div className = 'auth-card-header'>
                <div className = 'auth-card-header-logo'>
                    <Logo />
                </div>
                <div className = 'auth-card-header-text'>
                    Change password
                </div>
            </div>

            {
                genericError &&
                <h5 className = 'generic-error'>{genericError}</h5>
            }

            <div className = 'auth-card-item'>
                <input type = 'password' placeholder = 'Old Password' value = {oldPassword} onChange = {handleOldPassword} className = 'auth-card-item-input' />
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
                <input type = 'submit' value = 'Change Password' className = 'auth-footer-submit' />
            </div>
        </form>
    </div>
</div>
}

export default ChangePassword;