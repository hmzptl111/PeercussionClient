import { createContext, useState } from 'react';

export const UserProfileCurrentTabContext = createContext();


export const UserProfileCurrentTabProvider = ({children}) => {
    const [currentTab, setCurrentTab] = useState('Posts');

    return <UserProfileCurrentTabContext.Provider value = {{currentTab, setCurrentTab}}>
    {children}
</UserProfileCurrentTabContext.Provider>
}