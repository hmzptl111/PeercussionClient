import { useContext } from "react";
import { UserProfileCurrentTabContext } from "../../contexts/UserProfileCurrentTab";
import {UserAuthStatusContext} from '../../contexts/UserAuthStatus';

const UserProfileNav = ({uName}) => {
    const {setCurrentTab} = useContext(UserProfileCurrentTabContext);

    const {user} = useContext(UserAuthStatusContext);

    return (
        <div>
            <button onClick = {() => setCurrentTab('Posts')}>Posts</button>
            <button onClick = {() => setCurrentTab('Friends')}>Friends</button>
            <button onClick = {() => setCurrentTab('Moderates Communities')}>Moderates Communities</button>
            <button onClick = {() => setCurrentTab('Following Communities')}>Following Communities</button>

            {
                user && uName === user.uName &&
                <button onClick = {() => setCurrentTab('Pending Requests')}>Pending Requests</button>
            }

            <button onClick = {() => setCurrentTab('Upvoted Posts')}>Upvoted Posts</button>
            {/* <button onClick = {() => setCurrentTab('Downvoted Posts')}>Downvoted Posts</button> */}
            <button onClick = {() => setCurrentTab('Comments')}>Comments</button>
            <button onClick = {() => setCurrentTab('About')}>About</button>
        </div>
    );
}

export default UserProfileNav;