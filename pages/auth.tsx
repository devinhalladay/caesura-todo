import firebase from "firebase";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { useEffect } from "react";

const Login = () => {
  const AuthUser = useAuthUser();

  useEffect(() => {
    console.log(AuthUser);
  });

  const login = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result);
        firebase.firestore().collection("users").doc(result.user.email).set({
          email: result.user.email,
          displayName: result.user.displayName,
        });
      });
  };

  return (
    <>
      <p>Your email is {AuthUser.email ? AuthUser.email : "unknown"}.</p>
      <button onClick={login}>Login</button>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})();

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(Login);
