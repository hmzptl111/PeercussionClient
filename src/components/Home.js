import { useEffect } from 'react';
import {useHistory} from 'react-router-dom';

import Header from './Header';

import PostThumbnail from './reusable/PostThumbnail';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../components/reusable/PopUp';

import UpdateUserProfilePicturePopup from './reusable/UpdateUserProfilePicturePopup';


const Home = () => {
    let history = useHistory();
    
    useEffect(() => {
        if(history.location.state && history.location.state.from === 'SignIn') {
            if(history.location.state.isUserNew) {
                let profilePictureSetupPopup = PopUp('Set up your Profile Picture', <UpdateUserProfilePicturePopup />);
                PopUpQueue(profilePictureSetupPopup);
                return;
            }
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Header />

            <PostThumbnail home = {true} />

            <Popup />
        </>
    );
};

export default Home;