import { createContext, useState } from "react";

export const CommunityCurrentTabContext = createContext();

export const CommunityCurrentTabProvider = ({children}) => {
    const [currentTab, setCurrentTab] = useState('Posts');

    return <CommunityCurrentTabContext.Provider value = {{currentTab, setCurrentTab}}>
        {children}
    </CommunityCurrentTabContext.Provider>
}