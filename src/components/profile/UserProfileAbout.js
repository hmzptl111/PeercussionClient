import Empty from "../reusable/Empty";

const UserProfileAbout = ({about}) => {
    return <div className = 'description'>
        {
            about ?
            <pre>{about}</pre>:
            <Empty text = 'Seems shy!' caption = 'User description unavailable' GIF = 'https://c.tenor.com/9ud1r4sc-QQAAAAC/confused-john-travolta.gif' />
        }
    </div>
}

export default UserProfileAbout;
