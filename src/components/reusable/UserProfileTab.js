const UserProfileTab = ({currentTab}) => {
    return (
        <>
            {currentTab === 'posts' && 'viewing posts'}
            {currentTab === 'comments' && 'viewing comments'}
            {currentTab === 'friends' && 'viewing friends'}
            {currentTab === 'about' && 'viewing about'}
        </>
    );
}

export default UserProfileTab;