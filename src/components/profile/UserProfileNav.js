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

            {
                user && uName === user.uName &&
                <button onClick = {() => setCurrentTab('Pending Requests')}>Pending Requests</button>
            }

            <button onClick = {() => setCurrentTab('Comments')}>Comments</button>
            <button onClick = {() => setCurrentTab('About')}>About</button>
        </div>
    );
}

export default UserProfileNav;