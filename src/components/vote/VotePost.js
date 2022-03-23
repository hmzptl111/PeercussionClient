import { useState } from 'react';

import axios from 'axios';

import Vote from './Vote';

import {PopUp, PopUpQueue} from '../reusable/PopUp';


const VotePost = ({pId, votes, isUpvoted, isDownvoted}) => {
    const [postVotes, setPostVotes] = useState(votes);
    const [isPostUpvoted, setIsPostUpvoted] = useState(isUpvoted);
    const [isPostDownvoted, setIsPostDownvoted] = useState(isDownvoted);

    const handlePostUpvote = async () => {
        const response = await axios.put('/votePost', {
            pId: pId,
            vote: 'upvote'
        });
        
        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }
        
        setIsPostUpvoted(oldState => !oldState);
        let code = response.data.message;
        if(code === 1) {
            setPostVotes(previousState => (previousState + 1));
        } else if(code === 2) {
            setPostVotes(previousState => (previousState + 2));
        } else if(code === 3) {
            setPostVotes(previousState => (previousState - 1));
        }
    }

    const handlePostDownvote = async () => {
        const response = await axios.put('/votePost', {
            pId: pId,
            vote: 'downvote'
        });
        
        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }
        
        setIsPostDownvoted(oldState => !oldState);
        let code = response.data.message;
        if(code === 4) {
            setPostVotes(previousState => (previousState - 1));
        } else if(code === 5) {
            setPostVotes(previousState => (previousState - 2));
        } else if(code === 6) {
            setPostVotes(previousState => (previousState + 1));
        }
    }
    
    return <Vote handleUpvote = {handlePostUpvote} handleDownvote = {handlePostDownvote} voteCount = {postVotes} isSubjectUpvoted = {isPostUpvoted} isSubjectDownvoted = {isPostDownvoted} setIsUpvoted = {setIsPostUpvoted} setIsDownvoted = {setIsPostDownvoted} />
}

export default VotePost;