import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';

export const whiteColor = '#ffffff';
export const blackColor = '#000000';
export const primaryDarkColor = '#736f72';
export const primaryMediumColor = '#b2b2b2';
export const primaryLightColor = '#f1f1f1';
export const primaryLighterColor = '#fafafa';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);