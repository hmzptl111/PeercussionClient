import { useContext, useEffect, useState } from 'react';

import Follow from './Follow';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import ChatShare from '../chat/ChatShare';

import axios from 'axios';

const PageBanner = ({cName, cThumbnail, uName, type, target}) => {
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

            if(response.status === 200) {
                console.log(response.data);
                setIsOwner(response.data.isOwner);
                setFollowingStatus(response.data.isFollowing);
            }
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
        if(response.status === 200) {
            console.log(response.data.message);
            const communityThumbnailImage = await axios.post('/getCommunityThumbnail', {cName: cName});
            if(communityThumbnailImage.status === 200) {
                setCommunityThumbnail(communityThumbnailImage.data.url);
            }
        }
    }

    return <>
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

                <Popup trigger = {<button>Share</button>} modal = {true}>
                    <ChatShare cName = {cName} />
                </Popup>
            </div>
        </div>
    </>
}

export default PageBanner;