import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR
} from 'next-firebase-auth';
import { useState } from 'react';

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
