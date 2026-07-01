import React from 'react';
import ReactDOM from 'react-dom/client';

// Dynamic imports here are deliberate, not cosmetic: they make webpack emit
// two separate JS bundles. The booking-link bundle must never contain
// src/api.js or src/apiKey.js (the internal API key), so App must be loaded
// on a code-split path that the booking page never touches.
const params = new URLSearchParams(window.location.search);
const isBooking = params.get('form') === 'booking';

const root = ReactDOM.createRoot(document.getElementById('root'));

const load = isBooking
  ? import('./BookingRequestForm')
  : import('./App');

load.then(({ default: Root }) => {
  root.render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  );
});
