import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import logo from "./assets/image.png";
import "./SignIn.css";

const SignIn = ({ onSignIn }) => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, provider)
      .then((result) => {
        onSignIn(result.user);
      })
      .catch((error) => {
        console.error("Error signing in with Google: ", error.message);
      });
  };

  return (
    <>
      <button className="sign-in-btn" onClick={signInWithGoogle}>
        <img style={{ width: "3rem", height: "3rem" }} src={logo} />
        Sign in with Google
      </button>
    </>
  );
};

export default SignIn;
