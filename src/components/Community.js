import '../styles/Community.css';

import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import axios from 'axios';

import Header from './Header';
import PageBanner from './reusable/PageBanner';
import CommunityNav from './community/CommunityNav';
import CommunityTab from './community/CommunityTab';

import {ReactComponent as RestrictedIcon} from '../images/restricted_community.svg';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from './reusable/PopUp';


const Community = () => {
    const {cName} = useParams();

    const [community, setCommunity] = useState();
    const [isRestricted, setIsRestricted] = useState(false);
    const [followingStatus, setFollowingStatus] = useState();
    const [isOwner, setIsOwner] = useState();
    
    useEffect(() => {
        const getCommunityInfo = async () => {
            const community = await axios.post(`/community/${cName}`);

            if(community.data.error === 'restricted') {
                setIsRestricted(true);
                return;
            }
            setIsRestricted(false);

            if(community.data.error) {
                let errorPopup = PopUp('Something went wrong', community.data.error);
                PopUpQueue(errorPopup);
                return;
            }

            setCommunity(community.data.message);
        }
        
        getCommunityInfo();
        // eslint-disable-next-line
    }, [cName]);

    useEffect(() => {
        if(!community) return;
        const getFollowStatus = async () => {
            const payload = {
                type: 'community',
                target: community._id
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
    }, [community, isOwner, followingStatus]);

    return <>
    <Header />

    {
        community && !isRestricted ?
        <div className = 'community'>
            <PageBanner cName = {cName} cThumbnail = {community.cThumbnail} type = 'community' target = {community._id} isOwner = {isOwner} followingStatus = {followingStatus} setFollowingStatus = {setFollowingStatus} />

            <CommunityNav />
            <CommunityTab community = {community} isOwner = {isOwner} setCommunity = {setCommunity} />
        </div>:
        <div className = 'restriction-message'>
            <RestrictedIcon />
            You are restricted from accessing this community
        </div>
    }

    <Popup />
</>
};

export default Community;