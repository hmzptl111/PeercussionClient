import React from 'react';
import '../styles/App.css';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import { UserAuthStatusProvider } from '../contexts/UserAuthStatus';
import { UserStatusProvider } from '../contexts/UserStatus';
import { UserProfileCurrentTabProvider } from '../contexts/UserProfileCurrentTab';
import {CommunityCurrentTabProvider} from '../contexts/CommunityCurrentTab';
import {UserRoomsProvider} from '../contexts/UserRooms';
import {SocketProvider} from '../contexts/Socket';

// import Header from './Header';
import Home from './Home';
import Post from './Post';
import Community from './Community';
import CreatePost from './create/CreatePost';
import CreateCommunity from './create/CreateCommunity';
import SignUp from './auth/SignUp';
import SignIn from './auth/SignIn';
import User from './User';
import UserProfilePicture from './profile/UserProfilePicture';
import Chat from './Chat';


function App() {

  return (
    <Router>
      <>
        <UserAuthStatusProvider>
          <UserStatusProvider>
            {/* <Header /> */}
            <Switch>
              <Route exact path = '/signup' component = {SignUp}></Route>
              <Route exact path = '/signin' component = {SignIn}></Route>
              <CommunityCurrentTabProvider>
              <UserProfileCurrentTabProvider>
                <SocketProvider>
                  <UserRoomsProvider>
                    <Route exact path = '/' component = {Home}></Route>
                    <Route exact path = '/create/post' component = {CreatePost}></Route>
                    <Route exact path = '/create/community' component = {CreateCommunity}></Route>
                    <Route exact path = '/chat' component = {Chat}></Route>
                    <Route path = '/u/:uName' component = {User}></Route>
                    <Route path = '/c/:cName' component = {Community}></Route>
                    <Route path = '/p/:pId' component = {Post}></Route>
                    {/* action = [view, edit] */}
                    <Route path = '/profilePicture/:action' component = {UserProfilePicture}></Route>
                  </UserRoomsProvider>
                </SocketProvider>
              </UserProfileCurrentTabProvider>
              </CommunityCurrentTabProvider>
            </Switch>
          </UserStatusProvider>
        </UserAuthStatusProvider>
      </>
    </Router>
  );
}

export default App;
