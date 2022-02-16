import {useState} from 'react';
import axios from 'axios';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';

const VoteComment = ({cId, votes}) => {
    const [commentVotes, setCommentVotes] = useState(votes);

    const handleCommentUpvote = async () => {
        const response = await axios.put('/voteComment', {
            cId: cId,
            vote: 'upvote'
        });

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        let code = response.data.message;
        if(code === 1) {
            setCommentVotes(previousState => (previousState + 1));
        } else if(code === 2) {
            setCommentVotes(previousState => (previousState + 2));
        } else if(code === 3) {
            setCommentVotes(previousState => (previousState - 1));
        }
    }
    
    const handleCommentDownvote = async () => {
        const response = await axios.put('/voteComment', {
            cId: cId,
            vote: 'downvote'
        });

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        let code = response.data.message;
        if(code === 4) {
            setCommentVotes(previousState => (previousState - 1));
        } else if(code === 5) {
            setCommentVotes(previousState => (previousState - 2));
        } else if(code === 6) {
            setCommentVotes(previousState => (previousState + 1));
        }
    }
    
    return (
        <>
            <button onClick = {handleCommentUpvote}>Upvote</button>
            {commentVotes}
            <button onClick = {handleCommentDownvote}>Downvote</button>

            <Popup />
        </>
    )
}

export default VoteComment;