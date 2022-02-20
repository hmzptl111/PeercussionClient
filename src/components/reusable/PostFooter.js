import '../../styles/reusable/PostFooter.css';

import { Link } from 'react-router-dom';

import {ReactComponent as ShareIcon} from '../../images/share.svg';
import {ReactComponent as CommentIcon} from '../../images/comment.svg';

import VotePost from '../vote/VotePost';

import ChatShare from '../chat/ChatShare';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from './PopUp';

import FormatToKMBT from './FormatToKMBT';

const PostFooter = ({pId, pTitle, pThumbnail, uName, pCName, totalComments, votes, isUpvoted, isDownvoted}) => {
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


    return <>
        <div className = 'post-footer'>

            <div onClick = {handleShareButtonClick} className = 'share'>
                <ShareIcon />
                Share
            </div>

            <Link to = {`/p/${pId}#comments`} className = 'post-footer-comment'>
                <CommentIcon />
                <FormatToKMBT number = {totalComments} />
            </Link>

            <VotePost pId = {pId} votes = {votes} isUpvoted = {isUpvoted} isDownvoted = {isDownvoted} />
        </div>

        <Popup />
    </>
}

export default PostFooter;