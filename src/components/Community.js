import {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';

import Header from './Header';

const Community = () => {
    const {cName} = useParams();
    const [community, setCommunity] = useState({
        createdAt: null,
        desc: '',
        downvotes: 0,
        followers: 0,
        cName: '',
        relatedCommunities: [],
        updatedAt: null,
        _id: null
    });
    const [postIDs, setPostIDs] = useState([]);
    const [posts, setPosts] = useState([]);
    const [postsOffset, setPostsOffset] = useState(0);
    const totalPostIDsReturnedInCurrentBatch = useRef(0);
    const [loading, setLoading] = useState(true);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const observer = useRef();

    const lastPostRef = useCallback(node => {
        if(loading) return;

        observer.current && observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMorePosts) {
                fetchPostIDs(cName);
            }
        });

        if(node) {
            observer.current.observe(node);
        }
        //eslint-disable-next-line
    }, [loading, hasMorePosts]);

    useEffect(() => {
        const fetchPosts = () => {
            if(postIDs.length === 0) return;
            let newPostIDs = postIDs.slice(-totalPostIDsReturnedInCurrentBatch.current);
            newPostIDs !== [] && axios.post('/postsThumbnails?postIDs=' + JSON.stringify(newPostIDs))
                .then(posts => {
                    setPosts(previousPosts => {
                        return [
                            ...previousPosts,
                            ...posts.data
                        ]
                    });
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                });
        }

        fetchPosts(postIDs);
    }, [postIDs]);

    const fetchPostIDs = async (communityName) => {
        if(!communityName) return;
        setLoading(true);
        const postIDs = await axios.post('/community/' + communityName + '?fetchPostIDs=true&postOffset=' + postsOffset);
        if(postIDs.data.length <= 0) {
            setHasMorePosts(false);
            setLoading(false);
            return;
        } else if(postIDs.data.length < 3 && postIDs.data.length > 0) {
            setHasMorePosts(false);
            setLoading(false);
        }
        totalPostIDsReturnedInCurrentBatch.current = postIDs.data.length;
        setPostIDs(previousState => {
            return [
                ...previousState,
                ...postIDs.data
            ]
        });
        setPostsOffset(previousState => {
            return previousState + postIDs.data.length;
        })
    }
    
    useEffect(() => {
        fetchPostIDs(community.cName);
        //eslint-disable-next-line
    }, [community]);

    useEffect(() => {
        setPosts([]);
        setPostsOffset(0);
        setPostIDs([]);
        const getCommunityInfo = async (communityName) => {
            const community = await axios.post('/community/' + communityName);
            if(!community.data) return;
            setCommunity(community.data);   
        }
    
        getCommunityInfo(cName);
    }, [cName]);

    return (
        <>
            <Header />
            <div>{community.cName}</div>
            <div>
                {
                    posts.map((post, index) => {
                        if(posts.length === index + 1) {
                            return <Link to = {'/p/' + post._id} key = {post._id}>
                                        <div style = {{border: '1px solid black', paddingTop: '150px', paddingBottom: '150px'}} ref = {lastPostRef}>{post.title}</div>
                                    </Link>
                        }
                        return <Link to = {'/p/' + post._id} key = {post._id}>
                                    <div style = {{border: '1px solid black', paddingTop: '150px', paddingBottom: '150px'}}>{post.title}</div>
                                </Link>
                    })
                }
            </div>
            {loading && 'Please wait...loading'}
            {!hasMorePosts && 'You\'ve reached the end'}
        </>
    )
};

export default Community;