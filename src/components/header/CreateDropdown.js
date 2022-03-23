import '../../styles/header/CreateDropdown.css';

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as DropdownIcon } from '../../images/dropdown.svg';


const CreateDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const dropdownRef = useRef();

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


    return <div className='create-dropdown' ref = {dropdownRef}>
    <button className = 'create-dropdown-button' onClick = {() => setIsDropdownOpen(oldIsDropdownOpen => !oldIsDropdownOpen)}>
        Create
        <DropdownIcon className = {isDropdownOpen ? 'dropdown-icon-rotate': null} />
    </button>

    {
        isDropdownOpen &&
        <div className='create-dropdown-list'>
            <Link to='/create/post' className = 'create-dropdown-list-item' onClick = {() => setIsDropdownOpen(false)}>
                    {/* <span className='initials-pill'>p/</span> */}
                    <span className = 'create-dropdown-list-item-text'>Create a post</span>
            </Link>

            <Link to = '/create/community' className = 'create-dropdown-list-item' onClick = {() => setIsDropdownOpen(false)}>
                    {/* <span className='initials-pill'>c/</span> */}
                    <span className = 'create-dropdown-list-item-text'>Create a community</span>
            </Link>
        </div>
    }
</div>
};

export default CreateDropdown;

