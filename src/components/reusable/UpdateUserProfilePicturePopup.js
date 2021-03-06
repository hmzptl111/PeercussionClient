import '../../styles/reusable/UpdateUserProfilePicturePopup.css';

import { useHistory } from 'react-router-dom';

import { ReactComponent as CameraIcon } from '../../images/camera.svg';
import { ReactComponent as UploadIcon } from '../../images/upload.svg';

import Popup from 'react-popup';


const UpdateUserProfilePicturePopup = () => {
    let history = useHistory();

    const handleClickPhotoTab = () => {
        Popup.close();
        history.push('/profilePicture/edit/cam');
    }
    
    const handleChooseImageTab = () => {
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

    <Popup />
</div>
}

export default UpdateUserProfilePicturePopup;