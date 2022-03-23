import { useParams } from 'react-router-dom'

import SetUserProfileUsingCamera from '../profile/SetUserProfileUsingCamera';
import SetUserProfileUsingLocalImage from './SetUserProfileUsingLocalImage';


const EditProfilePicture = () => {
    const {action} = useParams();

    return action === 'cam' ?
    <SetUserProfileUsingCamera />:
    action === 'pic' &&
    <SetUserProfileUsingLocalImage />
}

export default EditProfilePicture;