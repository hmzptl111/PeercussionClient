import '../../styles/reusable/PostThumbnail.css';

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"

import axios from "axios";

import PostFooter from "./PostFooter"
import GeneralProfileIcon from './GeneralProfileIcon';
import InitialsIcon from './InitialsIcon';
import ScrollToTop from '../reusable/ScrollToTop';
import Empty from '../reusable/Empty';

import Popup from 'react-popup';
import {PopUp, PopUpQueue} from '../reusable/PopUp';


const PostThumbnail = ({cName, uName, home, getUserUpvotedPosts = false, isOwner}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    const postsOffset = useRef(0);
    const observer = useRef();

    const controller = new AbortController();
    const {signal} = controller;

    const fetchPosts = async () => {
        setLoading(true);
        let newPosts;
        
        if(home) {
            newPosts = await axios.post('/postThumbnail/home', {
                postsOffset: postsOffset.current
            }, {signal: signal});
        } else if(cName) {
            newPosts = await axios.post('/postThumbnail/community', {
                communityName: cName,
                postsOffset: postsOffset.current
            }, {signal: signal});
        } else if(uName) {
            if(!getUserUpvotedPosts) {
                newPosts = await axios.post('/postThumbnail/user', {
                    uName: uName,
                    postsOffset: postsOffset.current
                }, {signal: signal});
            } else {
                newPosts = await axios.post('/getUpvotedPosts', {
                    uName: uName,
                    postsOffset: postsOffset.current
                }, {signal: signal});
            }
        }

        if(newPosts.data.error) {
            let errorPopup = PopUp('Something went wrong', newPosts.data.error);
            PopUpQueue(errorPopup);
            return;
        }
        
        postsOffset.current += newPosts.data.message.length;

        setPosts(previousState => {
            return [
                ...previousState,
                ...newPosts.data.message
            ];
        });
        setLoading(false);
        
        if(newPosts.data.message.length < 3) {
            setHasMorePosts(false);
            return;
        }
        
        setHasMorePosts(true);
    }

    const lastPostRef = useCallback(node => {
        if(loading) return;

        observer.current && observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMorePosts) {
                fetchPosts();
            }
        });

        if(node) {
            observer.current.observe(node);
        }
        // eslint-disable-next-line
    }, [loading, hasMorePosts]);

    const renderThumbnailImage = block => {
        if(block.thumbnail) {
            return <img key = {block._id} src = {block.thumbnail} alt = {block.title} className = 'post-body-thumbnail-image'></img>;
        }
    }

    useEffect(() => {
        postsOffset.current = 0;
        setPosts([]);
        
        fetchPosts();
        
        return () => controller.abort();
        // eslint-disable-next-line
    }, [cName, uName]);
    
    return <div className = 'posts-container'>
    <div className = 'posts'>
        {
            posts.length > 0 ?
            posts.map((post, index) => {
                if(posts.length === index + 1) {
                        return <div key = {post._id} className = 'post-thumbnail'>
                                    <div ref = {lastPostRef}>
                                        <div className = 'post-header'>
                                            {
                                                !uName &&
                                                <Link to = {`/u/${post.uName}`} className = 'post-header-link post-header-user'>
                                                    {
                                                        post.uProfilePicture ?
                                                        <GeneralProfileIcon imageSource = 'profilePictures' imageID = {post.uProfilePicture} />:
                                                        <InitialsIcon initial = {post.uName[0]} />
                                                    }
                                                    {post.uName}
                                                </Link>
                                            }

                                            {
                                                !cName &&
                                                <Link to = {`/c/${post.cName}`} className = 'post-header-community'>
                                                    {`c/${post.cName}`}
                                                </Link>
                                            }
                                        </div>
                                        
                                        <Link to = {'/p/' + post._id} className = 'post-body'>
                                            <h3 className = 'post-body-title'>{post.title}</h3>
                                            
                                            {renderThumbnailImage(post)}
                                        </Link>
                                    </div>

                                    <PostFooter pId = {post._id} pTitle = {post.title} pThumbnail = {post.thumbnail} uName = {post.uName} pCName = {post.cName} totalComments = {post.totalComments} votes = {post.upvotes - post.downvotes} isUpvoted = {post.isUpvoted} isDownvoted = {post.isDownvoted} isOwner = {isOwner} posts = {posts} setPosts = {setPosts} />
                                </div>
                } else {
                    return <div key = {post._id} className = 'post-thumbnail'>
                                <div>
                                    <div className = 'post-header'>
                                        {
                                            !uName &&
                                            <Link to = {`/u/${post.uName}`} className = 'post-header-link post-header-user'>
                                                {
                                                    post.uProfilePicture ?
                                                    <GeneralProfileIcon imageSource = 'profilePictures' imageID = {post.uProfilePicture} />:
                                                    <InitialsIcon initial = {post.uName[0]} />
                                                }
                                                {post.uName}
                                            </Link>
                                        }

                                        {
                                            !cName &&
                                            <Link to = {`/c/${post.cName}`} className = 'post-header-community'>
                                                    {`c/${post.cName}`}
                                            </Link>
                                        }
                                    </div>
                                    
                                    <Link to = {'/p/' + post._id} className = 'post-body'>
                                        <h3 className = 'post-body-title'>{post.title}</h3>
                                        
                                        {renderThumbnailImage(post)}
                                    </Link>
                                </div>

                                <PostFooter pId = {post._id} pTitle = {post.title} pThumbnail = {post.thumbnail} uName = {post.uName} pCName = {post.cName} totalComments = {post.totalComments} votes = {post.upvotes - post.downvotes} isUpvoted = {post.isUpvoted} isDownvoted = {post.isDownvoted} isOwner = {isOwner} posts = {posts} setPosts = {setPosts} />
                            </div>
                }
            }):
            <Empty text = 'No footprint' caption = {getUserUpvotedPosts ? 'Hello?': 'Be the first one to post here'} GIF = 'https://c.tenor.com/tK-85ZSJyvUAAAAC/hello-homer-simpson.gif' />
        }
    </div>

    {
        !hasMorePosts && posts.length > 0 &&
        <div className = 'scroll-to-top'>
            <ScrollToTop />
        </div>
    }

    <Popup />
</div>
}

export default PostThumbnail;