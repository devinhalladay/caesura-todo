import 'tailwindcss/tailwind.css';
import initAuth from '../lib/auth';

initAuth();

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
