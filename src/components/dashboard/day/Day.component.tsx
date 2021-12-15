import { Box } from "@mui/material";
import React from "react";
import DayEvent from "../dayEvent/DayEvent.component";
import { basicMargin } from "./constants";
import { DayComponent } from "./types";

const dayComponent: DayComponent = ({ events }) => {
  return (
    <Box
      sx={{
        width: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: basicMargin,
      }}
    >
      {events.map((event, index) => {
        return <DayEvent key={index} event={event} />;
      })}
    </Box>
  );
};

export default dayComponent;
