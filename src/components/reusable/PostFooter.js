import '../../styles/reusable/PostFooter.css';

import { Link } from 'react-router-dom';

import axios from 'axios';

import VotePost from '../vote/VotePost';
import ChatShare from '../chat/ChatShare';

import FormatToKMBT from './FormatToKMBT';

import {ReactComponent as ShareIcon} from '../../images/share.svg';
import {ReactComponent as CommentIcon} from '../../images/comment.svg';
import {ReactComponent as BinIcon} from '../../images/bin.svg';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from './PopUp';


const PostFooter = ({pId, pTitle, pThumbnail, uName, pCName, totalComments, votes, isUpvoted, isDownvoted, isOwner, posts, setPosts}) => {
    const post = {
        pId,
        pTitle,
        pThumbnail,
        uName,
        cName: pCName
    }

    const handleShareButtonClick = () => {
        const sharePopup = PopUp('Share post with', <ChatShare post = {post} />);
        PopUpQueue(sharePopup);
    }

    const handleRemove = async () => {
        const payload = {
            pId: pId,
            pCName: pCName,
            pUName: uName,
            schema: 'post'
        }

        const response = await axios.post('/update', payload);

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        const updatedPosts = posts.filter(p => p._id !== pId);
        setPosts(updatedPosts);

        let successPopup = PopUp('Update', response.data.message);
        PopUpQueue(successPopup);
        return;
    }

    return <div className = 'post-footer'>
    <div onClick = {handleShareButtonClick} className = 'share'>
        <ShareIcon />
        Share
    </div>

    <Link to = {`/p/${pId}#comments`} className = 'post-footer-comment'>
        <CommentIcon />
        <FormatToKMBT number = {totalComments} />
    </Link>

    <VotePost pId = {pId} votes = {votes} isUpvoted = {isUpvoted} isDownvoted = {isDownvoted} />
    
    {
        isOwner === 'yes' &&
        <div onClick = {handleRemove} className = 'remove-post'>
            <BinIcon />
        </div>
    }

    <Popup />
</div>
}

export default PostFooter;