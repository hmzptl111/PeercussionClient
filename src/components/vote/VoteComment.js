import {useState} from 'react';
import axios from 'axios';

const VoteComment = ({cId, votes}) => {
    const [commentVotes, setCommentVotes] = useState(votes);

    const handleCommentUpvote = async () => {
        const response = await axios.put('/voteComment', {
            cId: cId,
            vote: 'upvote'
        });
        console.log(response.data);
        if(response.status === 200) {
            let code = response.data.code;
            if(code === 1) {
                setCommentVotes(previousState => (previousState + 1));
            } else if(code === 2) {
                setCommentVotes(previousState => (previousState + 2));
            } else if(code === 3) {
                setCommentVotes(previousState => (previousState - 1));
            }
        }
    }
    
    const handleCommentDownvote = async () => {
        const response = await axios.put('/voteComment', {
            cId: cId,
            vote: 'downvote'
        });
        console.log(response.data);
        if(response.status === 200) {
            let code = response.data.code;
            if(code === 4) {
                setCommentVotes(previousState => (previousState - 1));
            } else if(code === 5) {
                setCommentVotes(previousState => (previousState - 2));
            } else if(code === 6) {
                setCommentVotes(previousState => (previousState + 1));
            }
        }
    }
    
    return (
        <>
            <button onClick = {handleCommentUpvote}>Upvote</button>
            {commentVotes}
            <button onClick = {handleCommentDownvote}>Downvote</button>
        </>
    )
}

export default VoteComment;