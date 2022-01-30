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
            if(response.status === 200) {
                if(response.data.isAuth) {
                    setUser({
                        uId: response.data.uId,
                        uName: response.data.uName
                    });
                    setIsUserSignedIn(true);
                }
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