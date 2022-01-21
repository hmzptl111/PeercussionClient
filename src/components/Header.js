import React from 'react';
import '../styles/Header.css';

// import BackButton from './header/BackButton';
import Logo from './header/Logo';
import SearchInput from './header/SearchInput';
import SignInOutButton from './header/SignInOutButton';
import SignUpButton from './reusable/SignUpButton';
import ChatButton from './header/ChatButton';
import UserProfileButton from './header/UserProfileButton';
import MenuButton from './header/MenuButton';
import CreateDropdown from './header/CreateDropdown';

const Header = () => {
    return(
        <div className = 'header'>
            <div className = 'header-left'>
                {/* <BackButton /> */}
                <Logo />
                <SearchInput />
                <CreateDropdown />
            </div>
            <div className = 'header-right'>
                <div className = 'auth-buttons'>
                    <SignInOutButton />
                    <SignUpButton />
                </div>
                <ChatButton />
                <UserProfileButton  />
                <MenuButton />
            </div>
        </div>
    );
};

export default Header;