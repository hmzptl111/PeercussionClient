import { useState } from "react";
import { useParams } from "react-router-dom";
import UserProfileNav from "./reusable/UserProfileNav";
import UserProfileTab from "./reusable/UserProfileTab";

import Header from "./Header";

const User = () => {
    const {uName} = useParams();
    const [currentTab, setCurrentTab] = useState('posts');
    
    //display other stuff
    return (
        <>
            <Header />
            {uName}
            <UserProfileNav setCurrentTab = {setCurrentTab} />
            <UserProfileTab currentTab = {currentTab} />
        </>
    );
}

export default User;