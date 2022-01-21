import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import VoteComment from '../vote/VoteComment';

import axios from 'axios';

const UserProfileComments = ({uName}) => {
    const [userComments, setUserComments] = useState([]);

    useEffect(() => {
        const getComments = async () => {
            const comments = await axios.post('/getComments', {uName: uName});
            console.log(comments.data);
            setUserComments(comments.data);
        }

        getComments();

        //eslint-disable-next-line
    }, [uName]);

    return <div>
                {
                    userComments.length > 0 ?
                    userComments.map(c => {
                        return <div key = {c._id} style = {{width: '60%', border: '1px solid grey'}}>
                            <div style = {{display: 'flex', justifyContent: 'space-between'}}>
                                <span>
                                    Posted on 
                                    {   
                                        <Link to = {`/p/${c.pId}`} style = {{paddingLeft: '0.25em'}}>{c.pTitle}</Link>
                                    }
                                </span>

                                <span>
                                    {
                                        <Link to = {`/c/${c.cName}`}>{c.cName}</Link>
                                    }
                                </span>
                            </div>

                            <div>
                                {c.comment}
                            </div>
                            
                            <button>Share</button>
                            <VoteComment cId = {c._id} votes = {c.upvotes - c.downvotes} />
                        </div>
                    }):
                    'No comments'
                }
        </div>
}

export default UserProfileComments;