import '../../styles/auth/AuthButton.css';

import { Link } from 'react-router-dom';

const SignUpButton = () => {

    return <Link to = '/signup' className = 'auth-dark-button auth-button'>
        Sign up
</Link>
};

export default SignUpButton;