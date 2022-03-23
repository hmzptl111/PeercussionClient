import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Header from './Header';
import PostThumbnail from './reusable/PostThumbnail';
import UpdateUserProfilePicturePopup from './reusable/UpdateUserProfilePicturePopup';

import {PopUp, PopUpQueue} from '../components/reusable/PopUp';


const Home = () => {
    let history = useHistory();
    
    useEffect(() => {
        if(!history.location.state) return;

        if(history.location.state.from === 'SignIn') {
            if(history.location.state.isUserNew) {
                let profilePictureSetupPopup = PopUp('Set up your Profile Picture', <UpdateUserProfilePicturePopup />);
                PopUpQueue(profilePictureSetupPopup);

                history.replace({...history.location, state: {}});
                return;
            }
        } else if(history.location.state.from === 'ChangePassword') {
            let changePasswordPopup = PopUp('Update', history.location.state.message);
            PopUpQueue(changePasswordPopup);

            history.replace({...history.location, state: {}});
            return;
        }
        // eslint-disable-next-line
    }, []);

    return <>
    <Header />

    <PostThumbnail home = {true} />
</>
};

export default Home;