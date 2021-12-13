import React, { useCallback } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  Avatar,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, padding } from "@mui/system";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const theme = createTheme();

const Login = () => {
  const handleLogin = useCallback(async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <MedicationIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            It looks like you're not logged in yet
          </Typography>
          <Paper
            sx={{
              minWidth: 250,
              padding: 5,
              marginTop: 5,
            }}
            elevation={16}
          >
            <Typography component="h2" variant="h5">
              Please use your Google account to log in
            </Typography>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Log in with Google <GoogleIcon />
            </Button>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
