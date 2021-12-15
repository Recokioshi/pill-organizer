import React from "react";

import Day from "./day/Day.component";
import { getSampleDay } from "../../api/hooks/dayData/getSampleDay";
import { Box } from "@mui/material";
import { PAGES } from "../header/constants";
import { WithHeaderProps } from "../header/withHeader";
import EventManager from "./eventManagement/EventManager.component";

const DayPage = () => <Day events={getSampleDay()} />;
const EventManagerPage = () => <EventManager />;

type DashboardComponentProps = {} & Partial<WithHeaderProps>;

const DashboardComponent: React.FC<DashboardComponentProps> = ({
  currentPage,
}) => {
  let pageToRender;
  switch (currentPage) {
    case PAGES.EVENT_MANAGER:
      pageToRender = <EventManagerPage />;
      break;
    case PAGES.DAY:
      pageToRender = <DayPage />;
      break;
    default:
      pageToRender = <div>ERROR - Unknown page</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 1,
      }}
    >
      {pageToRender}
    </Box>
  );
};

export default DashboardComponent;
