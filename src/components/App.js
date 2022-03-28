import '../styles/App.css';

import React from 'react';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import { UserAuthStatusProvider } from '../contexts/UserAuthStatus';
import { UserStatusProvider } from '../contexts/UserStatus';
import { UserProfileCurrentTabProvider } from '../contexts/UserProfileCurrentTab';
import {CommunityCurrentTabProvider} from '../contexts/CommunityCurrentTab';
import {UserRoomsProvider} from '../contexts/UserRooms';
import {SocketProvider} from '../contexts/Socket';

import Home from './Home';
import Post from './Post';
import Community from './Community';
import CreatePost from './create/CreatePost';
import CreateCommunity from './create/CreateCommunity';
import SignUp from './auth/SignUp';
import SignIn from './auth/SignIn';
import User from './User';
import ViewUserProfilePicture from './profile/ViewUserProfilePicture';
import EditProfilePicture from './profile/EditProfilePicture';
import ChangePassword from './auth/ChangePassword';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import Chat from './Chat';

import 'react-popup/dist/index.css';
import Popup from 'react-popup';


function App() {
  return (
    <Router>
      <>
        <UserAuthStatusProvider>
          <UserStatusProvider>
            <Switch>
              <Route exact path = '/signup' component = {SignUp} />
              <Route exact path = '/signin' component = {SignIn} />
              <CommunityCurrentTabProvider>
              <UserProfileCurrentTabProvider>
                <SocketProvider>
                  <UserRoomsProvider>
                    <Route exact path = '/' component = {Home} />
                    <Route exact path = '/create/post' component = {CreatePost} />
                    <Route exact path = '/create/community' component = {CreateCommunity} />
                    <Route exact path = '/chat' component = {Chat} />
                    <Route path = '/u/:uName' component = {User} />
                    <Route path = '/c/:cName' component = {Community} />
                    <Route path = '/p/:pId' component = {Post} />
                    <Route path = '/profilePicture/view' component = {ViewUserProfilePicture} />
                    <Route path = '/profilePicture/edit/:action' component = {EditProfilePicture} />
                    <Route path = '/resetPassword/:token' component = {ResetPassword} />
                    <Route path = '/changePassword' component = {ChangePassword} />
                    <Route path = '/forgotPassword' component = {ForgotPassword} />
                    <Popup />
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
