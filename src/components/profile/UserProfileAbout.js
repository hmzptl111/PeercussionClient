const UserProfileAbout = ({about}) => {
    return <div className = 'description'>
        {
            about ?
            <pre>{about}</pre>:
            'Looks empty!'
        }
    </div>
}

export default UserProfileAbout;
