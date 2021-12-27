import React from "react";
import { getAuth, User } from "firebase/auth";

import { FirebaseApp } from "firebase/app";

import { useEffect, useState } from "react";

import "./App.css";
import { firebaseApp } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "../login/Login.component";
import { WithHeader } from "../header/withHeader";
import DashboardComponent from "../dashboard/Dashboard.component";
import { Splash } from "./Splash.component";

const auth = getAuth(firebaseApp);
export const UserContext = React.createContext<User | null>(null);

const App = () => {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!app) {
      setApp(firebaseApp);
    }
  }, [app]);

  if (loading) {
    return <Splash />;
  }
  if (user) {
    return (
      <UserContext.Provider value={user}>
        <WithHeader>
          <DashboardComponent />
        </WithHeader>
      </UserContext.Provider>
    );
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  return <Login />;
};

export default App;
