import '../../styles/profile/UserProfileAbout.css';

import { useContext, useEffect, useRef, useState } from 'react';

import {UserAuthStatusContext} from '../../contexts/UserAuthStatus';

import axios from 'axios';

import Empty from "../reusable/Empty";

import Popup from 'react-popup';
import { PopUp, PopUpQueue } from '../reusable/PopUp';

import {ReactComponent as EditIcon} from '../../images/edit.svg';


const UserProfileAbout = ({about, targetUser, setUser}) => {
    const [updatedAbout, setUpdatedAbout] = useState(about);
    const [isEditing, setIsEditing] = useState(false);
    const [isAccountStatusPrivate, setIsAccountStatusPrivate] = useState(targetUser.isAccountPrivate);
    
    const {user} = useContext(UserAuthStatusContext);
    
    const aboutRef = useRef();
    const accountStatusControlPill = useRef();
    const accountStatusControlCircle = useRef();


    useEffect(() => {
        const updateAccountStatus = async () => {
            if(!isEditing) return;
            if(!isAccountStatusPrivate) {
                accountStatusControlPill.current.style.justifyContent = 'left';
                accountStatusControlCircle.current.style.backgroundColor = '#b2b2b2';
            } else {
                accountStatusControlPill.current.style.justifyContent = 'right';
                accountStatusControlCircle.current.style.backgroundColor = '#736f72';
            }

            const payload = {
                body: isAccountStatusPrivate,
                field: 'isAccountPrivate',
                schema: 'user'
            }

            const response = await axios.post('/update', payload);

            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }
        }

        updateAccountStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, isAccountStatusPrivate]);

    useEffect(() => {
        if(isEditing) {
            aboutRef.current.contentEditable = true;
            aboutRef.current.focus();
            return;
        }
        
        aboutRef.current.contentEditable = false;
        aboutRef.current.blur();
    }, [isEditing]);

    const handleChange = e => {
        setUpdatedAbout(e.target.innerText);
    }

    const handleEdit = () => {
        setIsEditing(previousState => !previousState);
    }

    const handleUpdate = async () => {
        const payload = {
            body: updatedAbout,
            field: 'about',
            schema: 'user'
        }

        const response = await axios.post('/update', payload);

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setIsEditing(false);

        setUser(previousState => {
            return {
                ...previousState,
                about: updatedAbout
            }
        });

        let successPopup = PopUp('Update', response.data.message);
        PopUpQueue(successPopup);
        return;
    }

    return <div className = 'description tab-content-container'>
    {
        user.uId === targetUser._id &&
        <div className = 'edit' onClick = {handleEdit}>
            <EditIcon />
        </div>
    }

    {
        isEditing &&
        <div className = 'status-control account-status' onClick = {() => {setIsAccountStatusPrivate(previousState => !previousState)}}>
            {
                isAccountStatusPrivate ?
                <span>Private</span>:
                <span>Public</span>
            }
            <div ref = {accountStatusControlPill} className = 'status-control-pill'>
                <span ref = {accountStatusControlCircle} className = 'status-control-circle'></span>
            </div>
        </div>
    }

    <div className = 'description-content-container'>
        {
            about ?
            <pre ref = {aboutRef} className = 'description-input' contentEditable = {false} onInput = {handleChange}>{about}</pre>:
            <Empty text = 'Seems shy!' caption = 'User description unavailable' GIF = 'https://c.tenor.com/9ud1r4sc-QQAAAAC/confused-john-travolta.gif' />
        }
        {
            isEditing &&
            <div className = 'update-btn' onClick = {handleUpdate}>Update</div>
        }
    </div>

    <Popup />
</div>
}

export default UserProfileAbout;
