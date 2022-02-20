import {useRef, useState} from 'react';

import { useHistory } from 'react-router-dom';

import axios from 'axios';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

import {ReactComponent as ViewProfilePicture} from '../../images/user_default_profile.svg';

const SetUserProfileUsingLocalImage = () => {
    const imageFromDevicePreviewRef = useRef();

    const [hasSelected, setHasSelected] = useState(false);
    const [imageFromDevice, setImageFromDevice] = useState(false);

    let history = useHistory();
    
    const handleImageFromDeviceSelected = e => {
        if(!e.target.files[0]) return;
        console.log(e.target.files[0]);

        imageFromDevicePreviewRef.current.src = URL.createObjectURL(e.target.files[0]);
        imageFromDevicePreviewRef.current.style.display = 'block';

        setHasSelected(true);
        setImageFromDevice(e.target.files[0]);

        imageFromDevicePreviewRef.current.onload = () => {
            //free memory after image is loaded
            URL.revokeObjectURL(imageFromDevicePreviewRef.current.src);
        }
    }
    
    const handleViewProfilePicture = () => {
        Popup.close();
        history.push('/profilePicture/view');
    }

    const handleSetProfilePictureFromDevice = async () => {
        const profilePicture = new FormData();

        profilePicture.set('profilePictureUsingLocalImage', imageFromDevice);

        const response = await axios.post('/setProfilePictureUsingLocalImage', profilePicture);

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        imageFromDevicePreviewRef.current.src = '';
        imageFromDevicePreviewRef.current.style.display = 'none';

        setHasSelected(false);
        setImageFromDevice(null);

        let successPopup = PopUp('Profile picture updated',
            <div to = '/profilePicture/view' onClick = {handleViewProfilePicture} style = {{cursor: 'pointer'}}>
                <ViewProfilePicture />
                View updated profile picture
            </div>
        );
        PopUpQueue(successPopup);
    }
    
    return <>
            <input type = 'file' onChange = {handleImageFromDeviceSelected} />

            <img src = '' alt = '' width = '300' height = '300' name = 'profilePictureUsingLocalImage' ref = {imageFromDevicePreviewRef} style = {{display: 'none'}} />

            {
                hasSelected &&
                <button onClick={handleSetProfilePictureFromDevice}>Set Profile Picture</button>
            }

            <Popup />
        </>
}

export default SetUserProfileUsingLocalImage;