import { useEffect, useState } from "react";

import Follow from './Follow';

import axios from 'axios';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

const GetCommunities = ({uName, cName, type}) => {
    const [communities, setCommunities] = useState();

    useEffect(() => {
        const getCommunities = async () => {
            let response;
            if(type === 'moderates') {
                response = await axios.post('/getModeratesCommunities', {uName: uName});
            } else if(type === 'following') {
                response = await axios.post('/getFollowingCommunities', {uName: uName});
            } else if(type === 'related') {
                response = await axios.post('/getRelatedCommunities', {cName: cName});
            }

            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }
            
            setCommunities(response.data.message);
        }

        getCommunities();
        // eslint-disable-next-line
    }, [uName, cName, type]);

    const handleSetFollowingStatus = (newFollowingStatus, cId) => {
        setCommunities(previousState => {
            let newState = [...previousState];
            for(let i = 0; i < newState.length; i++) {
                if(newState[i].cId === cId) {
                    newState[i].isFollowing = newFollowingStatus;
                    break;
                }
            }
            return newState;
        });
    }

    return <>
            {
                communities && communities.length > 0 ?
                communities.map(c => (
                    <div key = {c.cName} style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '50%'}}>
                        <span>{c.cName}</span>

                        {
                            c.isFollowing &&
                            <Follow followingStatus = {c.isFollowing} setFollowingStatus = {handleSetFollowingStatus} type = 'community' target = {c.cId} />
                        }
                    </div>
                )):
                'No community found'
            }

            <Popup />
        </>
}

export default GetCommunities;