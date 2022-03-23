import '../../styles/reusable/UserStatusControl.css';

import { useContext, useEffect, useRef } from 'react';

import { UserStatusContext } from '../../contexts/UserStatus';

const UserStatusControl = () => {
    const {isUserOnline, setIsUserOnline} = useContext(UserStatusContext);

    const userStatusControlPill = useRef();
    const userStatusControlCircle = useRef();

    useEffect(() => {
        if(!isUserOnline) {
            userStatusControlPill.current.style.justifyContent = 'left';
            userStatusControlCircle.current.style.backgroundColor = '#b2b2b2';
        } else {
            userStatusControlPill.current.style.justifyContent = 'right';
            userStatusControlCircle.current.style.backgroundColor = '#666666';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserOnline]);

    return <div className = 'status-control' onClick = {() => {setIsUserOnline(!isUserOnline)}}>
    {
        isUserOnline ?
        <span>Online</span>:
        <span>Offline</span>
    }
    <div ref = {userStatusControlPill} className = 'status-control-pill'>
        <span ref = {userStatusControlCircle} className = 'status-control-circle'></span>
    </div>
</div>
};

export default UserStatusControl;