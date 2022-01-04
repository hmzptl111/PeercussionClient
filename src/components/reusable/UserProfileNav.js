const UserProfileNav = ({setCurrentTab}) => {
    return (
        <div>
            <button onClick = {() => setCurrentTab('posts')}>Posts</button>
            <button onClick = {() => setCurrentTab('comments')}>Comments</button>
            <button onClick = {() => setCurrentTab('friends')}>Friends</button>
            <button onClick = {() => setCurrentTab('about')}>About</button>
        </div>
    );
}

export default UserProfileNav;