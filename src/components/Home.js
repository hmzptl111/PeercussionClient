import { useEffect } from 'react';
import {useHistory} from 'react-router-dom';

import Header from './Header';

const Home = () => {
    let history = useHistory();

    useEffect(() => {
        if(history.location.state && history.location.state.from === 'SignIn') {
            console.log(history.location.pathname);
            if(history.location.state.isUserNew) {
                console.log('Please set up a profile picture');
                return;
            }
            console.log('Welcome back');
        }

        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Header />
            Home
        </>
    );
};

export default Home;