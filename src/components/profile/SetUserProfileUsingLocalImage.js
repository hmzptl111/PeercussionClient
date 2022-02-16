import {useRef, useState} from 'react';

import axios from 'axios';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

import {Link} from 'react-router-dom';

const SetUserProfileUsingLocalImage = () => {
    const imageFromDevicePreviewRef = useRef();

    const [hasSelected, setHasSelected] = useState(false);
    const [imageFromDevice, setImageFromDevice] = useState(false);
    
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
            <Link to = '/profilePicture/view'>View updated profile picture</Link>
        );
        PopUpQueue(successPopup);
    }
    
    return <>
            <input type = 'file' onChange = {handleImageFromDeviceSelected} />

            <img src = '' alt = '' width = '400' height = '300' name = 'profilePictureUsingLocalImage' ref = {imageFromDevicePreviewRef} style = {{display: 'none'}} />

            {
                hasSelected &&
                <button onClick={handleSetProfilePictureFromDevice}>Set Profile Picture</button>
            }

            <Popup />
        </>
}

export default SetUserProfileUsingLocalImage;