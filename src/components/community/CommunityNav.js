import { useContext } from "react";
import { CommunityCurrentTabContext } from '../../contexts/CommunityCurrentTab';

const UserProfileNav = () => {
    const {setCurrentTab} = useContext(CommunityCurrentTabContext);

    return (
        <div>
            <button onClick = {() => setCurrentTab('Posts')}>Posts</button>

            <button onClick = {() => setCurrentTab('Related Communities')}>Related Communities</button>

            <button onClick = {() => setCurrentTab('Restricted Users')}>Restricted Users</button>

            <button onClick = {() => setCurrentTab('Description')}>Description</button>
        </div>
    );
}

export default UserProfileNav;