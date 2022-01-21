import {useRef, useState} from 'react';

import axios from 'axios';


const SetUserProfileUsingLocalImage = () => {
    const imageFromDevicePreviewRef = useRef();

    const [hasSelected, setHasSelected] = useState(false);
    const [imageFromDevice, setImageFromDevice] = useState(false);
    
    const handleImageFromDeviceSelected = e => {
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

        // for(let entry of profilePicture.entries()) {
        //     console.log(entry[0]+', '+entry[1]);
        // }

        const response = await axios.post('/setProfilePictureUsingLocalImage', profilePicture);
        if(response.status === 200) {
            console.log(response.data.message);
        }
    }
    
    return <>
            <input type = 'file' onChange = {handleImageFromDeviceSelected} />

            <img src = '' alt = '' width = '400' height = '300' name = 'profilePictureUsingLocalImage' ref = {imageFromDevicePreviewRef} style = {{display: 'none'}} />

            {
                hasSelected &&
                <button onClick={handleSetProfilePictureFromDevice}>Set Profile Picture</button>
            }
        </>
}

export default SetUserProfileUsingLocalImage;