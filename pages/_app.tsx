import React from 'react';
import initAuth from '../lib/auth';
import 'tailwindcss/tailwind.css';
import '../assets/css/components/DatePicker/datepicker.scss';

initAuth();

function MyApp({ Component, pageProps }) {
  return (
    <div className="font-sans-serif">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
