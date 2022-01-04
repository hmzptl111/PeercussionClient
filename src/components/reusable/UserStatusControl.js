import React, { createRef, useContext, useEffect} from 'react';
import '../../styles/reusable/UserStatusControl.css';
import { UserStatusContext } from '../../contexts/UserStatus';

import { primaryDarkColor, primaryMediumColor } from '../../index';

const UserStatusControl = () => {
    const {isUserOnline, setIsUserOnline} = useContext(UserStatusContext);

    const userStatusControlPill = createRef();
    const userStatusControlCircle = createRef();

    useEffect(() => {
        if(!isUserOnline) {
            userStatusControlPill.current.style.justifyContent = 'left';
            userStatusControlCircle.current.style.backgroundColor = primaryMediumColor;
        } else {
            userStatusControlPill.current.style.justifyContent = 'right';
            userStatusControlCircle.current.style.backgroundColor = primaryDarkColor;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserOnline]);

    return(
        <li className = 'user-status-control'>
            {isUserOnline ? 'Online' : 'Offline'}
            <div ref = {userStatusControlPill} className = 'user-status-control-pill' onClick = {() => {setIsUserOnline(!isUserOnline)}}>
                <span ref = {userStatusControlCircle} className = 'user-status-control-circle'></span>
            </div>
        </li>
    );
};

export default UserStatusControl;