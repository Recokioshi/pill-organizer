import { Box } from "@mui/system";

const sx = {
  display: "flex",
  width: 1,
  height: "100vh",
  justifyContent: "center",
  alignItems: "center",
};

export const Splash = () => {
  return (
    <Box sx={sx}>
      <div>
        <img src="/logo512.png" alt="logo" className="App-logo" />
      </div>
    </Box>
  );
};
