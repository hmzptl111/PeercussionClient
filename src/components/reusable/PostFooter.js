import VotePost from '../vote/VotePost';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import ChatShare from '../chat/ChatShare';


const PostFooter = ({pId, pTitle, pThumbnail, uName, pCName, totalComments, votes}) => {
    return <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {/* <button onClick = {handlePostShare}>Share</button> */}
        <Popup trigger = {<button>Share</button>} modal = {true}>
            <ChatShare pId = {pId} pTitle = {pTitle} pThumbnail = {pThumbnail} uName = {uName} pCName = {pCName} />
        </Popup>
            {
                totalComments > 1 ?
                `${totalComments} comments`:
                totalComments === 0 ?
                'No comments':
                `${totalComments} comment`
            }
        <VotePost pId = {pId} votes = {votes} />
    </div>
}

export default PostFooter;