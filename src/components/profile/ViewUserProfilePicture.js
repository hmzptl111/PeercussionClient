import '../../styles/profile/ViewUserProfilePicture.css';

import {useContext, useEffect, useRef, useState} from 'react';

import {UserAuthStatusContext} from '../../contexts/UserAuthStatus';

// import BackButton from '../reusable/BackButton';
import {ReactComponent as RemoveIcon} from '../../images/remove.svg';
import {ReactComponent as UpdateIcon} from '../../images/update.svg';

import axios from 'axios';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

import UpdateUserProfilePicturePopup from '../reusable/UpdateUserProfilePicturePopup';

const ViewUserProfilePicture = () => {
    const [doesUserHaveProfilePicture, setDoesUserHaveProfilePicture] = useState(false);
    const userProfilePictureRef = useRef();

    const {user} = useContext(UserAuthStatusContext);

    useEffect(() => {
        if(!user) return;

        const getUserProfilePicture = async () => {
            const payload = {
                uName: user.uName
            }
            const response = await axios.post('/getProfilePicture',  payload);
            console.log(response.data);

            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }

            if(response.data.message === 'no pp found') {
                setDoesUserHaveProfilePicture(false);
                return;
            }

            setDoesUserHaveProfilePicture(true);
            userProfilePictureRef.current.setAttribute('src', `/uploads/profilePictures/${response.data.message}`);
        }

        getUserProfilePicture();
        // eslint-disable-next-line
    }, [user]);

    const handleRemoveProfilePicture = async () => {
        const response = await axios.post('/removeProfilePicture');

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setDoesUserHaveProfilePicture(false);
    }

    const handleUpdateProfilePicture = () => {
        let choice = PopUp('Set Profile Picture', <UpdateUserProfilePicturePopup />);
        PopUpQueue(choice);
        return;
    }

    return <>
                {/* <BackButton /> */}

                <div className = 'profile-picture-container'>
                    {
                        doesUserHaveProfilePicture ?
                        <div className = 'profile-picture-header' onClick = {handleRemoveProfilePicture}>
                            <RemoveIcon />
                            Remove
                        </div>:
                        <div className = 'profile-picture-header' onClick = {handleUpdateProfilePicture}>
                            <UpdateIcon />
                            Update
                        </div>
                    }
                </div>

                <div className = 'profile-picture-view'>
                    {
                        doesUserHaveProfilePicture ?
                        <img ref = {userProfilePictureRef} alt = '' height = '300' width = '300'></img>:
                        <div>Why so empty?</div>
                    }
                </div>

                <Popup />
        </>
}

export default ViewUserProfilePicture;