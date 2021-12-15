import React, { useCallback } from "react";
import { getAuth, signOut } from "firebase/auth";
import { AppBar, Button, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "./Menu.component";

const auth = getAuth();

const Header = () => {
  const [open, setOpen] = React.useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleOpenMenu = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Menu open={open} setOpen={setOpen} />
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={handleOpenMenu}>
            <MenuIcon />
          </Button>
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default Header;
