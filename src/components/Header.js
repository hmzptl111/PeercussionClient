import React, { useContext } from 'react';
import '../styles/Header.css';

import Logo from './header/Logo';
import SearchInput from './header/SearchInput';
import SignInOutButton from './header/SignInOutButton';
import SignUpButton from './reusable/SignUpButton';
import ChatButton from './header/ChatButton';
import UserProfileButton from './header/UserProfileButton';
import MenuButton from './header/MenuButton';
import CreateDropdown from './header/CreateDropdown';
import { UserAuthStatusContext } from '../contexts/UserAuthStatus';

const Header = () => {
    const {user, isUserSignedIn} = useContext(UserAuthStatusContext);

    return <div className = 'header'>
                    <div className = 'header-left'>
                        <div className = 'header-logo'>
                            <Logo />
                        </div>
                        <div className = 'header-search'>
                            <SearchInput />
                        </div>
                        <div className = 'header-create'>
                            <CreateDropdown />
                        </div>
                    </div>

                    <div className = 'header-right'>
                        {
                            (user && isUserSignedIn) ?
                            <>
                                <UserProfileButton  />
                                <div className = 'header-chat'>
                                    <ChatButton />
                                </div>
                            </>:
                            <>
                                <div className = 'header-auth'>
                                    <SignUpButton />
                                </div>
                            </>
                        }

                        <div className = 'header-auth'>
                            <SignInOutButton />
                        </div>

                        <MenuButton />
                    </div>

            </div>;
}

export default Header;