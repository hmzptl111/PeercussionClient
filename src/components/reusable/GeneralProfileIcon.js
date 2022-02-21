import '../../styles/reusable/GeneralProfileIcon.css';

import axios from 'axios';
import { useEffect, useState } from 'react';

const GeneralProfileIcon = ({imageSource, imageID, isBig}) => {
    const [isImageAvailable, setIsImageAvailable] = useState(true);

    useEffect(() => {
        const getImage = async () => {
            let response;
            try {
                response = await axios.get(`/uploads/${imageSource}/${imageID}`);
            } catch(e) {
                console.log(e);
                setIsImageAvailable(false);
            }
        }

        getImage();
    }, []);

    return <>
            {
                imageSource && imageID && isImageAvailable ?
                <img src = {`/uploads/${imageSource}/${imageID}`} className = {`profile-icon ${isBig && 'profie-icon-big'}`} alt = '' />:
                <b>?</b>
            }
        </>
}

export default GeneralProfileIcon;