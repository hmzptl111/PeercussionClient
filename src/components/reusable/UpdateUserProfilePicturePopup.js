import '../../styles/reusable/UpdateUserProfilePicturePopup.css';

import { useHistory } from "react-router-dom";

import Popup from 'react-popup';

import {ReactComponent as CameraIcon} from '../../images/camera.svg';
import {ReactComponent as UploadIcon} from '../../images/upload.svg';

const UpdateUserProfilePicturePopup = () => {
    let history = useHistory();

    const handleClickPhotoTab = () => {
        console.log('click photo');
        Popup.close();
        history.push('/profilePicture/edit/cam');
    }
    
    const handleChooseImageTab = () => {
        console.log('choose photo');
        Popup.close();
        history.push('/profilePicture/edit/pic');
    }

    return <div className = 'edit-user-profile-picture-popup'>
                <div onClick = {handleClickPhotoTab} className = 'edit-user-profile-picture-popup-item'>
                    <CameraIcon />
                    Click
                </div>
                <div onClick = {handleChooseImageTab} className = 'edit-user-profile-picture-popup-item'>
                    <UploadIcon />
                    Upload
                </div>
            </div>;
}

export default UpdateUserProfilePicturePopup;