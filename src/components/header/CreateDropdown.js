import React, { useEffect, useRef, useState } from 'react';
import '../../styles/header/CreateDropdown.css';

import { Link } from 'react-router-dom';

import { ReactComponent as DropdownIcon } from '../../images/dropdown.svg';

const CreateDropdown = () => {
    const dropdownRef = useRef();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if(isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', checkIfClickedOutside);

        return () => {
            document.removeEventListener('mousedown', checkIfClickedOutside);
        }
    }, [isDropdownOpen]);


    return (
        <div className='create-dropdown' ref = {dropdownRef}>
            <button className = 'create-dropdown-button' onClick = {() => setIsDropdownOpen(oldIsDropdownOpen => !oldIsDropdownOpen)}>
                Create
                <DropdownIcon className='dropdown-icon' />
            </button>

            {
                isDropdownOpen &&
                <ul className='create-dropdown-list'>
                    <Link to='/create/post' className = 'create-dropdown-list-item' onClick = {() => setIsDropdownOpen(false)}>
                        <li>
                            <span className='initials-pill'>p/</span>
                            Create a post
                        </li>
                    </Link>

                    <Link to = '/create/community' className = 'create-dropdown-list-item' onClick = {() => setIsDropdownOpen(false)}>
                        <li>
                            <span className='initials-pill'>c/</span>
                            Create a community
                        </li>
                    </Link>
                </ul>
            }
        </div>
    );
};

export default CreateDropdown;

