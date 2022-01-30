import React, { useContext, useEffect, useRef, useState } from 'react';
import '../../styles/header/MenuButton.css';
import {ReactComponent as MenuIcon} from '../../images/menu.svg';

import UserStatusControl from './../reusable/UserStatusControl';
import { UserAuthStatusContext } from '../../contexts/UserAuthStatus';

const MenuButton = () => {
    const {isUserSignedIn} = useContext(UserAuthStatusContext);
    const menuRef = useRef();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    return(
        <div className = 'menu-dropdown' ref = {menuRef}>
            <button className = 'menu-dropdown-button' onClick = {() => setIsMenuOpen(oldMenuState => !oldMenuState)}>
                <MenuIcon />
            </button>
            {
                isMenuOpen &&
                <ul className = 'menu-dropdown-list'>
                    {
                        isUserSignedIn &&
                        <UserStatusControl />
                    }
                    <a href = '/#' className = 'menu-dropdown-list-item'>
                        <li>
                            Privacy Policy
                        </li>
                    </a>
                    <a href = '/#' className = 'menu-dropdown-list-item'>
                        <li>
                            Terms and Conditions
                        </li>
                    </a>
                </ul>
            }
        </div>
    );
};

export default MenuButton;