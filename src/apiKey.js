// Shared secret sent by the internal app on every backend call.
// Must match API_KEY in backend/Code.gs exactly.
//
// IMPORTANT: only src/api.js may import this. The public booking page
// (src/BookingRequestForm.js) must NEVER import this file — it is
// code-split into a separate JS bundle (see src/index.js) specifically so
// this key is never shipped to anyone who only opens the shareable
// booking link.
export const API_KEY = 'ec0148-qa-9f3d7a2c5e816b4f0d9a3c7e2b5f8d1a';
