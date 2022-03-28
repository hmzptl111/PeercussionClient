import '../../styles/reusable/Follow.css';

import { useEffect, useState } from 'react';

import axios from "axios";

import { ReactComponent as FollowIcon } from '../../images/plus.svg';
import { ReactComponent as UnfollowIcon } from '../../images/close_small.svg';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';


const Follow = ({followingStatus, setFollowingStatus, type, target}) => {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        if(type === 'community') {
            if(followingStatus === 'no') {
                setButtonText('Follow');
            } else if(followingStatus === 'yes') {
                setButtonText('Unfollow');
            }
        } else if(type === 'user') {
            if(followingStatus === 'no') {
                setButtonText('Add Friend');
            } else if(followingStatus === 'yes') {
                setButtonText('Unfriend');
            } else if(followingStatus === 'pending') {
                setButtonText('Cancel Request');
            }
        }
    }, [type, followingStatus, target]);

    const handleFollow = async (e) => {
        e.preventDefault();

        let payload = {
            type: type,
            target: target
        };

        if(followingStatus === 'no') {
            const response = await axios.post('/follow', payload);

            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }

            if(type === 'community') {
                setFollowingStatus('yes');
                setButtonText('Unfollow');
            } else if(type === 'user') {
                setFollowingStatus('pending');
                setButtonText('Cancel Request');
            }
        } else if(followingStatus === 'yes') {
            const response = await axios.post('/unfollow', payload);

            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }
            
            if(type === 'community') {
                setFollowingStatus('no');
                setButtonText('Follow');
            } else if(type === 'user') {
                setFollowingStatus('no');
                setButtonText('Add Friend');
            }
        } else if(followingStatus === 'pending') {
            payload.cancelFriendRequest = true;
            const response = await axios.post('/unfollow', payload);
            
            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }
            
            if(response.data.message) {
                setFollowingStatus('yes');
                setButtonText('Unfriend');
            } else {
                setFollowingStatus('no');
                setButtonText('Add Friend');
            }
        }

    }

    return <div onClick = {handleFollow} className = 'follow'>
    { buttonText }
    {
        followingStatus === 'yes' ?
        <UnfollowIcon />:
        <FollowIcon />
    }

    <Popup />
</div>
}

export default Follow;