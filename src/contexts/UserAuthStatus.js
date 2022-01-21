import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserAuthStatusContext = createContext();

export const UserAuthStatusProvider = ({children}) => {
    const [user, setUser] = useState();
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);

    useEffect(() => {
        const checkUserAuthStatus = async () => {
            const response = await axios.post('/checkUserAuthStatus');
            if(response.data.isAuth) {
                setUser({
                    uId: response.data.uId,
                    uName: response.data.uName,
                });
                setIsUserSignedIn(true);
            }
        }   

        checkUserAuthStatus();
    }, []);

    return(
        <UserAuthStatusContext.Provider value = {{user, isUserSignedIn, setIsUserSignedIn}}>
            {children}
        </UserAuthStatusContext.Provider>
    );
};