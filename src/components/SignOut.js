import React from "react";
import { getAuth, signOut } from "firebase/auth";
import "./SignOut.css";

const SignOut = ({ onSignOut }) => {
  const handleSignOut = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        onSignOut();
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
      });
  };

  return (
    <button className="sign-out-btn" onClick={handleSignOut}>
      Logout
    </button>
  );
};

export default SignOut;
