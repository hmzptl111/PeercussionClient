import '../../styles/vote/Vote.css';

import { useEffect, useRef } from 'react';

import {ReactComponent as VoteIcon} from '../../images/vote.svg'
import FormatToKMBT from '../reusable/FormatToKMBT';

const Vote = ({handleUpvote, handleDownvote, voteCount, isSubjectUpvoted, isSubjectDownvoted, setIsUpvoted, setIsDownvoted}) => {
    const upvoteRef = useRef();
    const downvoteRef = useRef();

    useEffect(() => {
        if(isSubjectUpvoted) {
            upvoteRef.current.setAttribute('fill', 'rgb(0, 155, 55)');
            setIsDownvoted(false);
        } else {
            upvoteRef.current.setAttribute('fill', '#666666');
        }

    //eslint-disable-next-line
    }, [isSubjectUpvoted]);
    
    useEffect(() => {
        if(isSubjectDownvoted) {
            downvoteRef.current.setAttribute('fill', 'rgb(200, 0, 0)');
            setIsUpvoted(false);
        } else {
            downvoteRef.current.setAttribute('fill', '#666666');
        }
        
    //eslint-disable-next-line
    }, [isSubjectDownvoted]);

    
    return <div className = 'votes'>
                <div onClick = {handleUpvote} className = 'vote upvote'>
                    <VoteIcon ref = {upvoteRef} />
                </div>

                <div className = 'vote-count'>
                    <FormatToKMBT number = {voteCount} />
                </div>

                <div onClick = {handleDownvote} className = 'vote downvote'>
                    <VoteIcon ref = {downvoteRef} />
                </div>
        </div>
}

export default Vote;