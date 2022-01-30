import BackButton from '../reusable/BackButton';
import UserStatusControl from '../reusable/UserStatusControl';

import GeneralProfileIcon from '../reusable/GeneralProfileIcon';
import InitialsIcon from '../reusable/InitialsIcon';

const ChatSideBar = ({rooms, setCurrentChat}) => {

    const handleCurrentChatChange = (user) => {
        setCurrentChat(user);
    }

    return <div style = {{width: '30%', height: '100vh', border: '1px solid black'}}>
            <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <BackButton />
                <UserStatusControl />
            </div>

            <div style = {{display: 'flex', flexDirection: 'column'}}>
                {
                    rooms &&
                    rooms.map(u => (
                        <div key = {u.uId} onClick = {() => handleCurrentChatChange(u)} style = {{width: '100%', border: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style = {{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                {
                                    u.uProfilePicture ?
                                    <GeneralProfileIcon imageSource = 'profilePictures' imageID = {u.uProfilePicture} />:
                                    <InitialsIcon initial = {u.uName[0]} isUpperCase = {true} />
                                }
                                <div>{u.uName}</div>
                            </div>
                            <div>
                                {
                                    u.isUserOnline &&
                                    'Online'
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
}

export default ChatSideBar;