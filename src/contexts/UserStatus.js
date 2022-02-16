import { createContext, useState } from 'react';

export const UserStatusContext = createContext();

export const UserStatusProvider = ({children}) => {
    const [isUserOnline, setIsUserOnline] = useState(true);

    return(
        <UserStatusContext.Provider value = {{isUserOnline, setIsUserOnline}}>
            {children}
        </UserStatusContext.Provider>
    );
};