import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

import Header from './Header';
import PageBanner from './reusable/PageBanner';
import PostThumbnail from './reusable/PostThumbnail';

const Community = () => {
    const {cName} = useParams();
    const [community, setCommunity] = useState();
    
    useEffect(() => {
        console.log(cName);
        
        const getCommunityInfo = async () => {
            const community = await axios.post(`/community/${cName}`);
            if(community.status === 200) {
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
                community &&
                <PageBanner cName = {cName} cThumbnail = {community.cThumbnail} type = 'community' target = {community._id} />
            }
            
            {
                cName &&
                <PostThumbnail cName = {cName} />
            }
        </>
    )
};

export default Community;
