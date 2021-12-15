import React from "react";

import Day from "./day/Day.component";
import { getSampleDay } from "../../api/hooks/dayData/getSampleDay";
import { Box } from "@mui/material";

const DayPage = () => <Day events={getSampleDay()} />;

const DashboardComponent = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: 1,
    }}
  >
    <DayPage />
  </Box>
);

export default DashboardComponent;
