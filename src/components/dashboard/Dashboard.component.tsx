import React, { useContext, useEffect, useState } from "react";

import Day from "./day/Day.component";
import { getSampleDay } from "../../api/hooks/dayData/getSampleDay";
import { Box } from "@mui/material";
import { PAGES } from "../header/constants";
import { WithHeaderProps } from "../header/withHeader";
import EventManager from "./eventManagement/EventManager.component";
import GroupManager from "./groupManagement/GroupManager.component";
import { TEventGroup } from "../../api/types/eventGroup";
import { TDayEvent } from "../../api/types/dayEvent";
import { DayEvent } from "../../api/hooks/dayEvents";
import { UserContext } from "../app/App";
import { EventGroup } from "../../api/hooks/eventGroups";

const DayPage = () => <Day events={getSampleDay()} />;
const EventManagerPage = () => <EventManager />;
const GroupManagerPage = () => <GroupManager />;

type DashboardComponentProps = {} & Partial<WithHeaderProps>;

export const UserDataContext = React.createContext<{
  groups: TEventGroup[];
  events: TDayEvent[];
} | null>(null);

const DashboardComponent: React.FC<DashboardComponentProps> = ({
  currentPage,
}) => {
  const user = useContext(UserContext);

  const [events, updateEvents] = useState<TDayEvent[]>([]);
  const [groups, updateGroups] = useState<TEventGroup[]>([]);

  useEffect(() => {
    const unsubscribeEvents = DayEvent(user!).listenDayEvents(updateEvents);
    const unsubscribeGroups = EventGroup(user!).listenEventGroups(updateGroups);
    return () => {
      unsubscribeEvents();
      unsubscribeGroups();
    };
  }, [user]);

  let pageToRender;
  switch (currentPage) {
    case PAGES.EVENT_MANAGER:
      pageToRender = <EventManagerPage />;
      break;
    // case PAGES.DAY:
    //   pageToRender = <DayPage />;
    //   break;
    case PAGES.GROUP_MANAGER:
      pageToRender = <GroupManagerPage />;
      break;
    default:
      pageToRender = <div>ERROR - Unknown page</div>;
  }

  return (
    <UserDataContext.Provider value={{ groups, events }}>
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
    </UserDataContext.Provider>
  );
};

export default DashboardComponent;
