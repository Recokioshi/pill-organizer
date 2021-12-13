import React, { useCallback } from "react";
import { getAuth, signOut } from "firebase/auth";
import { AppBar, Button, Toolbar } from "@mui/material";
import { Box } from "@mui/system";

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default Header;
