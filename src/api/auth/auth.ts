// import { WebAuth } from 'auth0-js';
// import { removeActiveEntity } from '@/utils/services/activeEntity';

// export const auth0 = new WebAuth({
//   domain: import.meta.env.VITE_AUTH0_DOMAIN,
//   clientID: import.meta.env.VITE_AUTH0_CLIENT_ID,
//   redirectUri: `${import.meta.env.VITE_APP_URL}/loginCallback`,
//   responseType: 'token',
//   audience: import.meta.env.VITE_AUTH0_AUDIENCE,
// });

// export const auth = {
//   setToken: (token: string) => {
//     localStorage.setItem('apiKey', token);
//   },

//   getToken: () => {
//     return localStorage.getItem('apiKey');
//   },

//   removeToken: () => {
//     localStorage.removeItem('apiKey');
//     localStorage.removeItem('X-Impersonate-As-Email');
//     removeActiveEntity();

//     auth0.logout({
//       returnTo: import.meta.env.VITE_APP_URL,
//     });
//   },

// };
