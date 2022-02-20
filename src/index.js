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

export const blueColor1 = '#041421';
export const blueColor2 = '#1e4a63';
export const blueColor3 = '#5b7f97';
export const blueColor4 = '#c0d2dc';
export const blueColor5 = '#f6f6f4';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);