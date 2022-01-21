import { useState } from "react";

import BackButton from "../reusable/BackButton";
import SetUserProfileUsingCamera from "./SetUserProfileUsingCamera";
import SetUserProfileUsingLocalImage from "./SetUserProfileUsingLocalImage";

const EditUserProfilePicture = () => {
    const [profilePictureSource, setProfilePictureSource] = useState('');

    return <>
            <BackButton />

            <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <button onClick = {() => setProfilePictureSource('camera')}>Click photo</button>
                    <button onClick = {() => setProfilePictureSource('device')}>Use image from device</button>
                </div>
                
                {
                    profilePictureSource === 'camera' &&
                    <SetUserProfileUsingCamera />
                }

                {
                    profilePictureSource === 'device' &&
                    <SetUserProfileUsingLocalImage />
                }
            </div>
        </>
}

export default EditUserProfilePicture;