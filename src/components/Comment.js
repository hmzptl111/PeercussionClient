import '../styles/Comment.css';

import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import {UserAuthStatusContext} from '../contexts/UserAuthStatus';

import axios from 'axios';

import CreateComment from './create/CreateComment';
import VoteComment from './vote/VoteComment';
import GeneralProfileIcon from './reusable/GeneralProfileIcon';
import InitialsIcon from './reusable/InitialsIcon';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from './reusable/PopUp';


const Comment = ({pId, pTitle, cId, cName, setPost}) => {
    const [postComments, setPostComments] = useState([]);
    const [commentsOffset, setCommentsOffset] = useState(0);
    const totalCommentsReturnedInCurrentBatch = useRef(0);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [comment, setComment] = useState('');
    const [commentReply, setCommentReply] = useState('');
    
    const {user} = useContext(UserAuthStatusContext);

    const replyTo = useRef('');
    const commentsSectionRef = useRef();

    let history = useHistory();

    useEffect(() => {
        handleLoadMoreComments();

        if(history.location.hash === '#comments') {
            commentsSectionRef.current.scrollIntoView();
        }
        // eslint-disable-next-line
    }, [pId]);

    const handleLoadMoreComments = async () => {
        const newComments = await axios.post('/comments', {
            pId: pId,
            commentsOffset: commentsOffset
        });

        if(newComments.data.error) {
            let errorPopup = PopUp('Something went wrong', newComments.data.error);
            PopUpQueue(errorPopup);
            return;
        }
        
        totalCommentsReturnedInCurrentBatch.current = newComments.data.message.length;
        setCommentsOffset(previousState => {
            return previousState + newComments.data.message.length;
        });
        
        setPostComments(previousState => {
            return [
                ...previousState,
                ...newComments.data.message
            ];
        });
        
        if(newComments.data.message.length < 20) {
            setHasMoreComments(false);
            return;
        }
    }

    const handleLoadCommentReplies = async (e, postComment) => {
        e.preventDefault();

        if(e.target.textContent === 'Hide replies') {
            e.target.textContent = `${postComment.replies.length === 0 ? 'No': postComment.replies.length} Replies`;
            postComment.replies = [];
            setPostComments(previousState => {
                let postComments = [...previousState];
                for(let i = 0; i < postComments.length; i++) {
                    if(postComments[i] === postComment) {
                        postComments[i].replies = [];
                        break;
                    }
                }
                return postComments;
            });
        } else {
            e.target.textContent = 'Hide replies';
            const newComments = await axios.post('/comments', {
                replyTo: postComment._id
            });

            if(newComments.data.error) {
                let errorPopup = PopUp('Something went wrong', newComments.data.error);
                PopUpQueue(errorPopup);
                return;
            }

            setPostComments(previousState => {
                let postComments = [...previousState];
                for(let i = 0; i < postComments.length; i++) {
                    if(postComments[i] === postComment) {
                        postComments[i].replies = [...newComments.data.message];
                        break;
                    }
                }
                return postComments;
            });
        }

    }

    const handleCreateComment = async (e) => {
        e.preventDefault();

        const payload = {
            pId: pId,
            pTitle: pTitle,
            cId: cId,
            cName: cName,
            comment: comment
        };

        const response = await axios.post('/createComment', payload);

        if(response.data.error) {
            let errorPopup = PopUp('Something went wrong', response.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        setPost(previousState => {
            return {
                ...previousState,
                totalComments: previousState.totalComments + 1
            };
        });
        
        setComment('');

        setPostComments(previousState => {
            return [
                response.data.message,
                ...previousState,
            ];
        });
    }

    const handleCreateCommentReply = async (e, postComment) => {
        e.preventDefault();

        const payload = {
            pId: pId,
            pTitle: pTitle,
            cId: cId,
            cName: cName,
            comment: commentReply,
            replyTo: replyTo.current
        };

        const newReply = await axios.post('/createComment', payload);

        if(newReply.data.error) {
            let errorPopup = PopUp('Something went wrong', newReply.data.error);
            PopUpQueue(errorPopup);
            return;
        }

        let currentPostComments = postComments;
        for(let i = 0; i < currentPostComments.length; i++) {
            if(currentPostComments[i] === postComment) {
                let currentComment = currentPostComments[i];
                let currentCommentReplies = currentComment.replies;
                currentComment.replies = [newReply.data.message, ...currentCommentReplies];
            }
        }
        setPostComments(currentPostComments);

        setCommentReply('');
        handleCancelCreateCommentReply(e, postComment._id);
    }
    
    const handleCommentReply = (e, cId) => {
        e.preventDefault();
        
        setCommentReply('');
        replyTo.current = cId;
        for(let x = 0; x < document.getElementsByClassName('comment-reply').length; x++) {
            document.getElementsByClassName('comment-reply')[x].style.display = 'none';
        }
        document.getElementById(`${cId}-reply`).style.display = 'block';
    }


    const handleCancelCreateCommentReply = (e, cId) => {
        e.preventDefault();

        document.getElementById(`${cId}-reply`).style.display = 'none';
        setCommentReply('');
    }


    return <div ref = {commentsSectionRef} className = 'comments-container'>
    <CreateComment comment = {comment} setComment = {setComment} handleCreateComment = {handleCreateComment} uName = {user && user.uName} />

    {
        postComments.map(c => {
            return <div className = 'comments' key = {c._id}>
                        <div className = 'comment'>
                            <div className = 'comment-body'>
                                <Link to = {`/u/${c.uName}`} className = 'commenter-link'>
                                    {
                                        c.uProfilePicture ?
                                        <GeneralProfileIcon imageSource = 'profilePictures' imageID = {c.uProfilePicture} />:
                                        <InitialsIcon initial = {c.uName[0]} />
                                    }
                                </Link>

                                <div className = 'comment-text'>
                                    <Link to = {`/u/${c.uName}`} className = 'commenter-link'>
                                        <span className = 'commenter-name'>{c.uName}</span>
                                    </Link>
                                    
                                    <div className = 'comment-text-content'>{c.comment}</div>
                                </div>
                            </div>

                            <div className = 'comment-footer'>
                                <div onClick = {e => handleLoadCommentReplies(e, c)} className = 'comment-footer-button'>
                                    {c.replies.length === 0 ? `No`: c.replies.length} Replies
                                </div>
                                <div onClick = {e => handleCommentReply(e, c._id)} className = 'comment-footer-button'>
                                    Reply
                                </div>
                                
                                <VoteComment cId = {c._id} votes = {c.upvotes - c.downvotes} isUpvoted = {c.isUpvoted} isDownvoted = {c.isDownvoted} />
                            </div>
                        </div>
                        
                        <div id = {`${c._id}-reply`} className = 'comment-reply' style = {{display: 'none'}}>
                            <CreateComment comment = {commentReply} setComment = {setCommentReply} handleCreateCommentReply = {e => handleCreateCommentReply(e, c)} uName = {user && user.uName} replyTo = {c.uName} handleCancelCreateCommentReply = {e => handleCancelCreateCommentReply(e, c._id)} />
                        </div>

                        {
                            c.replies !== [] &&
                            <div style = {{paddingLeft: '1em'}}>
                                {
                                    c.replies.map(reply => {
                                        if(!reply.comment) return null;

                                        return <div className = 'comment reply' key = {reply._id}>
                                            <div className = 'comment-body'>
                                                <Link to = {`/u/${reply.uName}`} className = 'commenter-link'>
                                                    {
                                                        reply.uProfilePicture ?
                                                        <GeneralProfileIcon imageSource = 'profilePictures' imageID = {reply.uProfilePicture} />:
                                                        <InitialsIcon initial = {c.uName[0]} />
                                                    }
                                                    </Link>

                                                <div className = 'comment-text'>
                                                    <Link to = {`/u/${reply.uName}`} className = 'commenter-link'>
                                                            <span className = 'commenter-name'>{reply.uName}</span>
                                                    </Link>
                                                    
                                                    <div className = 'comment-text-content'>
                                                        {reply.comment}
                                                    </div>
                                                </div>
                                            </div>

                                            <VoteComment cId = {reply._id} votes = {reply.upvotes - reply.downvotes} isUpvoted = {reply.isUpvoted} isDownvoted = {reply.isDownvoted} />
                                        </div>
                                    })
                                }
                            </div>
                        }
                    </div>;
        })
    }
    
    {
        hasMoreComments &&
        <div onClick = {handleLoadMoreComments} className = 'load-more-comments'>
            <div className = 'load-more-comments-button'>Load more</div>
        </div>
    }

    <Popup />
</div>
}

export default Comment;