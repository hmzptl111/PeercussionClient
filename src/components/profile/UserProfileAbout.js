const UserProfileAbout = ({about}) => {
    return <>
        {
            about ?
            <pre>{about}</pre>:
            'Looks empty!'
        }
    </>
}

export default UserProfileAbout;