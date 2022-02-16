import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

import Header from './Header';
import PageBanner from './reusable/PageBanner';

import CommunityNav from './community/CommunityNav';
import CommunityTab from './community/CommunityTab';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from './reusable/PopUp';

const Community = () => {
    const {cName} = useParams();
    const [community, setCommunity] = useState();
    const [isRestricted, setIsRestricted] = useState(false);
    
    useEffect(() => {
        const getCommunityInfo = async () => {
            const community = await axios.post(`/community/${cName}`);

            if(community.data.error === 'restricted') {
                setIsRestricted(true);
                return;
            }

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

    return (
        <>
            <Header />

            {
                community && !isRestricted ?
                <>
                    <PageBanner cName = {cName} cThumbnail = {community.cThumbnail} type = 'community' target = {community._id} />

                    <CommunityNav />
                    <CommunityTab community = {community} />
                </>:
                'You are restricted from accessing this community'
            }

            <Popup />
        </>
    )
};

export default Community;
