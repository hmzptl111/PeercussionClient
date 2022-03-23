import '../../styles/profile/UserProfileComments.css';

import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import axios from 'axios';

import VoteComment from '../vote/VoteComment';
import Empty from '../reusable/Empty';

import {PopUp, PopUpQueue} from '../reusable/PopUp';


const UserProfileComments = ({uName}) => {
    const [userComments, setUserComments] = useState([]);

    useEffect(() => {
        const getComments = async () => {
            const comments = await axios.post('/getComments', {uName: uName});

            if(comments.data.error) {
                let errorPopup = PopUp('Something went wrong', comments.data.error);
                PopUpQueue(errorPopup);
                return;
            }
            console.log(comments.data.message);
            setUserComments(comments.data.message);
        }

        getComments();
        //eslint-disable-next-line
    }, [uName]);

    return <div className = 'user-comments'>
    {
        userComments.length > 0 ?
        userComments.map(c => {
            return <div key = {c._id} className = 'user-comment'>
                        <div className = 'user-comment-header'>
                                <div className = 'user-comment-post-info'>
                                    Posted on &nbsp;
                                    {   
                                        <Link to = {`/p/${c.pId}`} className = 'user-comment-header-link user-comment-post-title'>{`"${c.pTitle}"`}</Link>
                                    }
                                </div>

                                {
                                    <Link to = {`/c/${c.cName}`} className = 'user-comment-header-link'>c/{c.cName}</Link>
                                }
                        </div>

                        <div className = 'user-comment-body'>
                            {c.comment}
                        </div>
                        
                        <VoteComment cId = {c._id} votes = {c.upvotes - c.downvotes} isUpvoted = {c.isUpvoted} isDownvoted = {c.isDownvoted} />
                    </div>
        }):
        <Empty text = 'Shy?' caption = 'User has not commented in any post, yet' GIF = 'https://c.tenor.com/rec5dlPBK2cAAAAd/mr-bean-waiting.gif' />
    }
</div>
}

export default UserProfileComments;