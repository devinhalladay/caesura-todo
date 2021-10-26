import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import { useState } from 'react';
import {
  google, // The top level object used to access services
  calendar_v3, // Calendar API types
  Auth, // Namespace for auth related types
  Common, // General types used throughout the library
} from 'googleapis';

const Calendar = () => {
  const AuthUser = useAuthUser();

  const [data, setData] = useState();

  return <div>calendar</div>;
};

export const getServerSideProps = withAuthUserTokenSSR()(
  async ({ AuthUser }) => {
    return { props: {} };
  }
);

export default withAuthUser()(Calendar);
