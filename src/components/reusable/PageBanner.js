import { useEffect, useState } from 'react';

import Follow from './Follow';

import ChatShare from '../chat/ChatShare';

import axios from 'axios';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from './PopUp';

const PageBanner = ({cName, cThumbnail, uName, uProfilePicture, type, target}) => {
    const [followingStatus, setFollowingStatus] = useState();
    const [isOwner, setIsOwner] = useState();

    const [communityThumbnail, setCommunityThumbnail] = useState(cThumbnail);

    useEffect(() => {
        console.log(target);
        const getFollowStatus = async () => {
            const payload = {
                type: type,
                target: target
            }

            const response = await axios.post('/followStatus', payload);
            if(response.data.error) {
                let errorPopup = PopUp('Something went wrong', response.data.error);
                PopUpQueue(errorPopup);
                return;
            }

            setIsOwner(response.data.message.isOwner);
            setFollowingStatus(response.data.message.isFollowing);
        }

        getFollowStatus();
        // eslint-disable-next-line
    }, [target]);

    const handleImageFromDeviceSelected = async (e) => {
        console.log(e.target.files[0]);

        const communityThumbnail = new FormData();
        communityThumbnail.set('cName', cName);
        communityThumbnail.set('communityThumbnail', e.target.files[0]);

        const response = await axios.post('/setCommunityThumbnail', communityThumbnail);
        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        const communityThumbnailImage = await axios.post('/getCommunityThumbnail', {cName: cName});
        
        if(communityThumbnailImage.data.error) {
            let errorPopup = PopUp('Something went wrong', communityThumbnailImage.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setCommunityThumbnail(communityThumbnailImage.data.message);
    }

    
    const handleShare = () => {
        const community = {
            cName: cName,
            cThumbnail: cThumbnail
        }

        const user = {
            uName: uName,
            uProfilePicture: uProfilePicture
        }

        let sharePopup = PopUp(`Share ${(cName && 'community') || (uName && 'user profile')} with`, <ChatShare community = {cName && community} user = {uName && user} />);
        PopUpQueue(sharePopup);
    }

    return <>
        <div style = {{maxWidth: '98%'}}>
        {
            cName && communityThumbnail &&
            <img src = {`/uploads/communityThumbnails/${communityThumbnail}`} width = '100%' height = '150em' alt = '' />
        }

        <div style = {{paddingTop: '0.25rem', paddingBottom: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <p style = {{marginLeft: '0.25rem'}}>
                {cName && `c/${cName}`}
                {uName && `u/${uName}`}
            </p>

            <div>
                {
                    isOwner === 'no' &&
                    <Follow followingStatus = {followingStatus} setFollowingStatus = {setFollowingStatus} type = {type} target = {target} />
                }

                {
                    cName && isOwner === 'yes' &&
                    <input type = 'file' onChange = {handleImageFromDeviceSelected} />
                }

                <button onClick = {handleShare}>Share</button>
            </div>
        </div>
    </div>

    <Popup />
    </>
}

export default PageBanner;