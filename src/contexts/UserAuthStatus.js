import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserAuthStatusContext = createContext();

export const UserAuthStatusProvider = ({children}) => {
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);

    useEffect(() => {
        const checkUserAuthStatus = async () => {
            const response = await axios.post('/checkUserAuthStatus');
            if(response.data.message) {
                setIsUserSignedIn(true);
            }
        }   

        checkUserAuthStatus();
    }, []);

    return(
        <UserAuthStatusContext.Provider value = {{isUserSignedIn, setIsUserSignedIn}}>
            {children}
        </UserAuthStatusContext.Provider>
    );
};