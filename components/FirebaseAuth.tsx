/* globals window */
import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from '@firebase/auth';
import { useAuthUser } from 'next-firebase-auth';

const provider = new GoogleAuthProvider();

const firebaseAuthConfig = {
  signInFlow: 'popup',
  // Auth providers
  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  signInOptions: [
    {
      provider: provider,
      requireDisplayName: false,
    },
  ],
  signInSuccessUrl: '/',
  credentialHelper: 'none',
  callbacks: {
    // https://github.com/firebase/firebaseui-web#signinsuccesswithauthresultauthresult-redirecturl
    signInSuccessWithAuthResult: () =>
      // Don't automatically redirect. We handle redirects using
      // `next-firebase-auth`.
      false,
  },
};

const FirebaseAuth = () => {
  const signIn = () =>
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential =
          GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential =
          GoogleAuthProvider.credentialFromError(error);
        // ...
      });

  return (
    <div>
      <button onClick={signIn}>Sign in</button>
    </div>
  );
};

export default FirebaseAuth;
