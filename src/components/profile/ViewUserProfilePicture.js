import {useContext, useEffect, useRef, useState} from 'react';
import { Link } from 'react-router-dom';

import {UserAuthStatusContext} from '../../contexts/UserAuthStatus';

import BackButton from '../reusable/BackButton';

import axios from 'axios';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

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

    return <>
                <BackButton />

                <div style = {{display: 'grid', placeItems: 'center'}}>
                    {
                        
                        doesUserHaveProfilePicture ?
                        <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                            <img ref = {userProfilePictureRef} alt = '' height = '400' width = '300'></img>
                            <button onClick = {handleRemoveProfilePicture} style = {{marginTop: '1em'}}>Remove Profile Picture</button>
                        </div>:
                        <div>
                            Ooh, so empty!
                            <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Link to = '/profilePicture/edit'>Set profile picture</Link>
                            </div>
                        </div>

                    }
                </div>

                <Popup />
        </>
}

export default ViewUserProfilePicture;