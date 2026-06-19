import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import BookingRequestForm from './BookingRequestForm';

const params = new URLSearchParams(window.location.search);
const Root = params.get('form') === 'booking' ? BookingRequestForm : App;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
