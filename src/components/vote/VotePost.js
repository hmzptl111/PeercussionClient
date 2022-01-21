import {useState} from 'react';
import axios from 'axios';

const VotePost = ({pId, votes}) => {
    const [postVotes, setPostVotes] = useState(votes);

    const handlePostUpvote = async () => {
        const response = await axios.put('/votePost', {
            pId: pId,
            vote: 'upvote'
        });
        console.log(response.data);
        if(response.status === 200) {
            let code = response.data.code;
            if(code === 1) {
                setPostVotes(previousState => (previousState + 1));
            } else if(code === 2) {
                setPostVotes(previousState => (previousState + 2));
            } else if(code === 3) {
                setPostVotes(previousState => (previousState - 1));
            }
        }
    }
    
    const handlePostDownvote = async () => {
        const response = await axios.put('/votePost', {
            pId: pId,
            vote: 'downvote'
        });
        console.log(response.data);
        if(response.status === 200) {
            let code = response.data.code;
            if(code === 4) {
                setPostVotes(previousState => (previousState - 1));
            } else if(code === 5) {
                setPostVotes(previousState => (previousState - 2));
            } else if(code === 6) {
                setPostVotes(previousState => (previousState + 1));
            }
        }
    }
    
    return (
        <div>
            <button onClick = {handlePostUpvote}>Upvote</button>
            {postVotes}
            <button onClick = {handlePostDownvote}>Downvote</button>
        </div>
    )
}

export default VotePost;