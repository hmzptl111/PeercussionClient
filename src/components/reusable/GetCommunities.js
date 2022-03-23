import '../../styles/reusable/GetCommunities.css';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import Follow from './Follow';
import GeneralProfileIcon from './GeneralProfileIcon';
import InitialsIcon from './InitialsIcon';
import Empty from './Empty';

import {ReactComponent as RemoveIcon} from '../../images/close_small.svg';

import {PopUp, PopUpQueue} from '../reusable/PopUp';


const GetCommunities = ({uName, cName, type, isEditing, updatedRelatedCommunities, setUpdatedRelatedCommunities}) => {
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
            console.log(response.data.message);
        }

        getCommunities();
        // eslint-disable-next-line
    }, [uName, cName, type, updatedRelatedCommunities]);

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

    const handleRemove = async (cId) => {
        const payload = {
            action: 'remove',
            cName: cName,
            body: cId,
            field: 'relatedCommunities',
            schema: 'community'
        }

        const response = await axios.post('/update', payload);

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setCommunities(previousState => {
            let newState = previousState.filter(c => c.cId !== cId);
            return newState;
        });

        setUpdatedRelatedCommunities(previousState => {
            let newState = previousState.filter(c => c !== cId);
            return newState;
        });
    }

    return <div className = 'list-container'>
    {
        communities && communities.length > 0 ?
        communities.map(c => (
            <div key = {c.cName} className = 'list'>
                <Link to = {`/c/${c.cName}`} className = 'list-info'>
                    {
                        c.cThumbnail ?
                        <GeneralProfileIcon imageSource = 'communityThumbnails' imageID = {c.cThumbnail} />:
                        <InitialsIcon initial = {c.cName[0]} />
                    }
                    <span className = 'list-info-text'>{c.cName}</span>
                </Link>

                <div className='list-buttons' onClick = {() => handleRemove(c.cId)}>
                    {
                        isEditing &&
                        <div className = 'list-button'>
                            Remove
                            <RemoveIcon />
                        </div>
                    }

                    {
                        c.isFollowing &&
                        <Follow followingStatus = {c.isFollowing} setFollowingStatus = {handleSetFollowingStatus} type = 'community' target = {c.cId} />
                    }
                </div>
            </div>
        )):
        <Empty text = 'Why so lonely?' caption = {`${(type === 'moderates' && 'User does not moderate any community') || (type === 'following' && 'User does not follow any community') || (type === 'related' && 'No related communities found')}`} GIF = 'https://c.tenor.com/skrB3dpqD-oAAAAC/waiting-alone-lonely.gif' />
    }
</div>
}

export default GetCommunities;