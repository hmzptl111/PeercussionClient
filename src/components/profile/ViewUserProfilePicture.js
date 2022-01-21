import {useContext, useEffect, useRef, useState} from 'react';
import { Link } from 'react-router-dom';

import {UserAuthStatusContext} from '../../contexts/UserAuthStatus';

import BackButton from '../reusable/BackButton';

import axios from 'axios';

const ViewUserProfilePicture = () => {
    const [doesUserHaveProfilePicture, setDoesUserHaveProfilePicture] = useState(false);
    const userProfilePictureRef = useRef();

    const {user} = useContext(UserAuthStatusContext);

    useEffect(() => {
        const getUserProfilePicture = async () => {
            const payload = {
                uName: user.uName
            }
            const response = await axios.post('/getProfilePicture',  payload);
            console.log(response.data);

            if(response.status === 404) {
                console.log('oops, cant find');
                return;
            }

            if(response.data.message) {
                setDoesUserHaveProfilePicture(false);
                return;
            }

            setDoesUserHaveProfilePicture(true);
            userProfilePictureRef.current.setAttribute('src', response.data.url);
        }

        getUserProfilePicture();
        // eslint-disable-next-line
    }, []);

    const handleRemoveProfilePicture = async () => {
        const response = await axios.post('/removeProfilePicture');

        console.log(response);
        if(response.status === 200) {
            setDoesUserHaveProfilePicture(false);
            // userProfilePictureRef.current.setAttribute('src', '');
        }
    }

    return <>
                <BackButton />

                <div style = {{display: 'grid', placeItems: 'center'}}>
                    {
                        
                        doesUserHaveProfilePicture ?
                        <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                            <img ref = {userProfilePictureRef} alt = ''></img>
                            <button onClick = {handleRemoveProfilePicture} style = {{marginTop: '1em'}}>Remove Profile Picture</button>
                        </div>:
                        <div>
                            Ooh, so empty!
                            <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Link to = '/profilePicture/edit'>Set profile picture</Link>
                            </div>
                        </div>

                    }
                </div>
        </>
}

export default ViewUserProfilePicture;