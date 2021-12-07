import React, { useCallback } from "react";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

const Header = () => {
  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};
export default Header;
