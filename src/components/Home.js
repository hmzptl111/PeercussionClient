import { useEffect } from 'react';
import {useHistory} from 'react-router-dom';

import { Link } from 'react-router-dom';

import Header from './Header';

import PostThumbnail from './reusable/PostThumbnail';

import {ReactComponent as EditProfilePicture} from '../images/edit_profile_picture.svg';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../components/reusable/PopUp';

const Home = () => {
    let history = useHistory();
    
    useEffect(() => {
        if(history.location.state && history.location.state.from === 'SignIn') {
            if(history.location.state.isUserNew) {
                let profilePicturePopup = PopUp('Set up your Profile Picture',
                <Link to = {'/profilePicture/edit'}>
                    <div onClick = {() => Popup.close()}>
                        <EditProfilePicture />
                    </div>
                </Link>
                );
                PopUpQueue(profilePicturePopup);
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