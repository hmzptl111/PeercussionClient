import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

import Header from './Header';
import PageBanner from './reusable/PageBanner';

import CommunityNav from './community/CommunityNav';
import CommunityTab from './community/CommunityTab';

const Community = () => {
    const {cName} = useParams();
    const [community, setCommunity] = useState();
    const [isRestricted, setIsRestricted] = useState(false);
    
    useEffect(() => {
        console.log(cName);
        
        const getCommunityInfo = async () => {
            const community = await axios.post(`/community/${cName}`);
            if(community.data.error) {
                setIsRestricted(true);
                return;
            } else if(community.status === 200) {
                setCommunity(community.data);
            }
        }
        
        getCommunityInfo();
        // eslint-disable-next-line
    }, [cName]);

    useEffect(() => {
        console.log(community);
    }, [community]);

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
        </>
    )
};

export default Community;
