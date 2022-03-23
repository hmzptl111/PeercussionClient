import '../../styles/reusable/GeneralProfileIcon.css';

import { useEffect, useState } from 'react';

import axios from 'axios';


const GeneralProfileIcon = ({imageSource, imageID}) => {
    const [isImageAvailable, setIsImageAvailable] = useState(true);

    useEffect(() => {
        const getImage = async () => {
            try {
                await axios.get(`/uploads/${imageSource}/${imageID}`);
            } catch(e) {
                console.log(e);
                setIsImageAvailable(false);
            }
        }

        getImage();
        //eslint-disable-next-line
    }, []);

    return imageSource && imageID && isImageAvailable ?
<img src = {`/uploads/${imageSource}/${imageID}`} className = 'profile-icon' alt = '' />:
<b>?</b>
}

export default GeneralProfileIcon;