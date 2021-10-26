import React from 'react';
import initAuth from '../utils/initAuth';
import 'tailwindcss/tailwind.css';

initAuth();

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
