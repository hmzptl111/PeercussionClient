import '../../styles/reusable/PageBanner.css';

import { useEffect, useRef, useState } from 'react';

import axios from 'axios';

import InitialsIcon from './InitialsIcon';
import Follow from './Follow';
import ChatShare from '../chat/ChatShare';

import {ReactComponent as ShareIcon} from '../../images/post_share_small.svg';
import {ReactComponent as EditIcon} from '../../images/edit.svg';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from './PopUp';

const PageBanner = ({cName, cThumbnail, uName, uProfilePicture, type, target, isOwner, followingStatus, setFollowingStatus}) => {
    const [communityThumbnail, setCommunityThumbnail] = useState(cThumbnail);

    const pageBannerUpdateRef = useRef();

    useEffect(() => {
        setCommunityThumbnail(cThumbnail);

    }, [cThumbnail]);


    const handleImageFromDeviceSelected = async (e) => {

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

    const handlePageBannerMouseOver = () => {
        if(!pageBannerUpdateRef.current) return;
        pageBannerUpdateRef.current.style.display = 'flex';
        pageBannerUpdateRef.current.style.opacity = 1;
    }

    const handlePageBannerMouseLeave = () => {
        if(!pageBannerUpdateRef.current) return;
        pageBannerUpdateRef.current.style.opacity = 0.5;
    }

    return <div className = 'page-banner'>
    {
        <div className = 'page-banner-body' onMouseOver = {handlePageBannerMouseOver} onMouseLeave = {handlePageBannerMouseLeave}>
            {
                cName &&
                <>
                    {
                        communityThumbnail ?
                        <img src = {`/uploads/communityThumbnails/${communityThumbnail}`} className = 'page-banner-image' alt = '' />:
                        <InitialsIcon isBig = {true} initial = {cName[0]} />
                    }
                </>
            }

            {
                cName && isOwner === 'yes' &&
                <label className = 'page-banner-update' ref = {pageBannerUpdateRef}>
                    <input type = 'file' onChange = {handleImageFromDeviceSelected} className = 'page-banner-update-image' />
                    <EditIcon />
                </label>
            }

            <div className = 'page-banner-buttons'>
                <div className = 'page-banner-follow'>
                    {
                        isOwner === 'no' &&
                        <Follow followingStatus = {followingStatus} setFollowingStatus = {setFollowingStatus} type = {type} target = {target} />
                    }
                </div>

                <div onClick = {handleShare} className = 'share page-banner-share'>
                    Share
                    <ShareIcon />
                </div>
            </div>

        </div>
    }

    <Popup />
</div>
}

export default PageBanner;