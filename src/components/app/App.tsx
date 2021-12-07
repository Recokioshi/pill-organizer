import { getAuth } from "firebase/auth";
import { FirebaseApp } from 'firebase/app';

import { useEffect, useState } from "react";

import './App.css';
import { firebaseApp } from "../../config/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import Home from "../home/Home.component";
import Login from "../login/Login.component";

const auth = getAuth(firebaseApp);

const App = () => {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!app) {
      setApp(firebaseApp);
    }
  }, [app]);

  if (loading) {
    return <div>Loading ...</div>;
  }
  if (user) {
    return <Home />
  }
  if (error) {
    return <div>{error.message}</div>
  }
  return <Login />
};

export default App;
