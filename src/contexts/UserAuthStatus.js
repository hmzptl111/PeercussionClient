import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserAuthStatusContext = createContext();

export const UserAuthStatusProvider = ({children}) => {
    const [user, setUser] = useState();
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);

    useEffect(() => {
        console.log(user);
    }, [user]);

    useEffect(() => {
        const checkUserAuthStatus = async () => {
            const response = await axios.post('/checkUserAuthStatus');

            if(response.data.error) {
                setUser(null);
                setIsUserSignedIn(false);
            } else if(response.data.message && response.data.message.isAuth) {
                setUser({
                    uId: response.data.message.uId,
                    uName: response.data.message.uName
                });
                setIsUserSignedIn(true);
            }
        }   

        checkUserAuthStatus();
    }, []);

    return(
        <UserAuthStatusContext.Provider value = {{user, setUser, isUserSignedIn, setIsUserSignedIn}}>
            {children}
        </UserAuthStatusContext.Provider>
    );
};