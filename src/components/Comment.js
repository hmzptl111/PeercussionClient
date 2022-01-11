import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';

import axios from 'axios';

import CreateComment from './create/CreateComment';

import Cookies from 'js-cookie';


const Comment = ({pId}) => {
    
    const [postComments, setPostComments] = useState([]);
    const [commentsOffset, setCommentsOffset] = useState(0);
    const totalCommentsReturnedInCurrentBatch = useRef(0);
    const [hasMoreComments, setHasMoreComments] = useState(true);

    const [comment, setComment] = useState('');

    const [commentReply, setCommentReply] = useState('');
    const replyTo = useRef('');

    const uId = Cookies.get('uId');
    const uName = Cookies.get('uName');

    useEffect(() => {
        handleLoadMoreComments();

        // eslint-disable-next-line
    }, [pId]);

    const handleLoadMoreComments = async () => {
        const newComments = await axios.post('/comments', {
            pId: pId,
            commentsOffset: commentsOffset
        });
        
        totalCommentsReturnedInCurrentBatch.current = newComments.data.length;
        setCommentsOffset(previousState => {
            return previousState + newComments.data.length;
        });
        console.log(newComments.data);
        
        setPostComments(previousState => {
            return [
                ...previousState,
                ...newComments.data
            ];
        });
        
        if(newComments.data.length < 3) {
            setHasMoreComments(false);
            return;
        }

    }

    const handleLoadCommentReplies = async (e, postComment) => {
        e.preventDefault();

        const newComments = await axios.post('/comments', {
            replyTo: postComment._id
        });
        console.log(newComments.data);
        setPostComments(previousState => {
            let postComments = [...previousState];
            for(let i = 0; i < postComments.length; i++) {
                if(postComments[i] === postComment) {
                    postComments[i].replies = [...newComments.data];
                    break;
                }
            }
            return postComments;
        });
    }

    const handleCreateComment = async (e) => {
        e.preventDefault();

        const payload = {
            pId: pId,
            uId: uId,
            uName: uName,
            comment: comment
        };

        const response = await axios.post('/createComment', payload);
        console.log(response.data);
        console.log(response.data._id);
        console.log(response.data.uId);

        setComment('');

        setPostComments(previousState => {
            return [
                response.data,
                ...previousState,
            ];
        });
    }

    const handleCreateCommentReply = async (e, postComment) => {
        e.preventDefault();

        const payload = {
            pId: pId,
            uId: uId,
            uName: uName,
            comment: commentReply,
            replyTo: replyTo.current
        };

        const newReply = await axios.post('/createComment', payload);
        console.log(newReply.data);

        console.log(postComment);
        console.log(postComments);

        let currentPostComments = postComments;
        // let previousPostComments = [...previousState];
        for(let i = 0; i < currentPostComments.length; i++) {
            if(currentPostComments[i] === postComment) {
                let currentComment = currentPostComments[i];
                let currentCommentReplies = currentComment.replies;
                currentComment.replies = [newReply.data, ...currentCommentReplies];
            }
        }
        setPostComments(currentPostComments);

        setCommentReply('');
    }
    
    const handleCommentReply = (e, cId) => {
        e.preventDefault();
        
        setCommentReply('');
        replyTo.current = cId;
        for(let x = 0; x < document.getElementsByClassName('comment-reply').length; x++) {
            console.log(document.getElementsByClassName('comment-reply')[x]);
            document.getElementsByClassName('comment-reply')[x].style.display = 'none';
        }
        document.getElementById(`${cId}-reply`).style.display = 'block';
    }

    useEffect(() => {
        console.log(postComments);
    }, [postComments]);

    return (
        <div>
                <CreateComment comment = {comment} setComment = {setComment} handleCreateComment = {handleCreateComment} uName = {uName} />
                {
                    postComments.map(c => {
                        return <div key = {c._id} style = {{marginTop: '0.5em', marginBottom: '0.5em'}}>
                                    <div>
                                        <Link to = {`/u/${c.uName}`}>{c.uName}</Link>
                                    </div>
                                    
                                    {c.comment}
                                    
                                    <button onClick = {e => handleLoadCommentReplies(e, c)}>{c.replies.length} Replies</button>
                                    <button onClick = {e => handleCommentReply(e, c._id)}>Reply</button>
                                    
                                    <div id = {`${c._id}-reply`} className = 'comment-reply' style = {{display: 'none'}}>
                                        <CreateComment comment = {commentReply} setComment = {setCommentReply} handleCreateCommentReply = {e => handleCreateCommentReply(e, c)} uName = {uName} replyTo = {c.uName} />
                                    </div>

                                    {
                                        <div style = {{paddingLeft: '1em'}}>
                                            {
                                                c.replies.map(reply => {
                                                    if(!reply.comment) return;
                                                    return <div key = {reply._id}>
                                                        <div>
                                                            <Link to = {`/u/${reply.uName}`}>{reply.uName}</Link>
                                                        </div>
                                                        
                                                        <div>{reply.comment}</div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    }
                                </div>;
                    })
                }
                {
                    hasMoreComments ?
                    <button onClick = {handleLoadMoreComments}>Load more</button>:
                    'All comments loaded'
                }
            </div>
    );
}

export default Comment;