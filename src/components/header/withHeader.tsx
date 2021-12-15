import { Box } from "@mui/material";
import React from "react";
import Header from "./Header.component";

const headerHeight = 10;

export const WithHeader: React.FC = ({ children }) => {
  return (
    <Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          height: headerHeight,
          width: 1,
          bgcolor: "gray.1",
        }}
      >
        <Header />
      </Box>
      <Box
        sx={{
          display: "flex",
          marginTop: headerHeight,
          width: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
