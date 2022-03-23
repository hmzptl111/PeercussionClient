import '../../styles/header/MenuButton.css';

import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import UserStatusControl from './../reusable/UserStatusControl';
import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

import SignUpButton from '../reusable/SignUpButton';
import SignInOutButton from './SignInOutButton';

import {ReactComponent as DropdownIcon} from '../../images/dropdown.svg';
import {ReactComponent as MenuIcon} from '../../images/menu.svg';
import {ReactComponent as CloseIcon} from '../../images/close.svg';
import {ReactComponent as HomeIcon} from '../../images/home.svg';
import {ReactComponent as ChatIconSmall} from '../../images/chat_small.svg';


const MenuButton = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
    
    const {isUserSignedIn} = useContext(UserAuthStatusContext);
    
    const menuRef = useRef();
    
    useEffect(() => {
        const checkIfClickedOutside = e => {
          if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
            setIsMenuOpen(false);
          }
        }
    
        document.addEventListener('mousedown', checkIfClickedOutside);
    
        return () => {
          document.removeEventListener('mousedown', checkIfClickedOutside);
        }
      }, [isMenuOpen]);

    return <div className = 'menu-dropdown' ref = {menuRef}>
    <button className = 'menu-dropdown-button' onClick = {() => setIsMenuOpen(oldMenuState => !oldMenuState)}>
        <MenuIcon />
    </button>
    
    {
        isMenuOpen &&
        <div className = 'menu-dropdown-list'>
            <div className='menu-dropdown-close' onClick = {() => setIsMenuOpen(false)}>
                <CloseIcon />
            </div>

            {
                isUserSignedIn &&
                <>
                    <div className='menu-dropdown-list-item'>
                        <UserStatusControl />
                    </div>

                    <Link to = '/' className = 'menu-dropdown-list-item menu-dropdown-home'>
                            Home
                            <HomeIcon />
                    </Link>

                    <Link to = '/chat' className='menu-dropdown-list-item menu-dropdown-chat'>
                        Chat
                        <ChatIconSmall />
                        {/* <ChatButton isSmall = {true} /> */}
                    </Link>

                    <div className='menu-dropdown-list-item menu-dropdown-create'>
                        <div className='menu-dropdown-create-content' onClick = {() => setIsCreateDropdownOpen(oldMenuState => !oldMenuState)}>
                            Create
                            <DropdownIcon className = {isCreateDropdownOpen ? 'dropdown-icon-rotate': null} />
                        </div>

                    </div>

                    {
                        isCreateDropdownOpen &&
                        <div className='menu-dropdown-create-item'>
                            <Link to = '/create/post' className='menu-dropdown-list-item'>Create a post</Link>
                            <Link to = '/create/community' className='menu-dropdown-list-item'>Create a community</Link>
                        </div>
                    }
                </>
            }

            {
                !isUserSignedIn &&
                <>
                    <div className = 'menu-dropdown-list-item menu-dropdown-auth'>
                        <SignUpButton />
                    </div>
                    <div className = 'menu-dropdown-list-item menu-dropdown-auth'>
                        <SignInOutButton />
                    </div>
                </>
            }

            <Link to = '/#' className = 'menu-dropdown-list-item'>
                Privacy Policy
            </Link>
            <Link to = '/#' className = 'menu-dropdown-list-item'>
                Terms and Conditions
            </Link>
        </div>
    }

</div>
};

export default MenuButton;