import VotePost from '../vote/VotePost';

import ChatShare from '../chat/ChatShare';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from './PopUp';

const PostFooter = ({pId, pTitle, pThumbnail, uName, pCName, totalComments, votes}) => {
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
        <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>

            <button onClick = {handleShareButtonClick}>Share</button>

                {
                    totalComments > 1 ?
                    `${totalComments} comments`:
                    totalComments === 0 ?
                    'No comments':
                    `${totalComments} comment`
                }

            <VotePost pId = {pId} votes = {votes} />
        </div>

        <Popup />
    </>
}

export default PostFooter;