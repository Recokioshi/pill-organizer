import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../app/App";
import { DayEvent } from "../../../api/hooks/dayEvents";
import { TDayEvent } from "../../../api/types/dayEvent";
import { DayEventCard } from "./dayEventCard/DayEventCard.component";

const EventManager = () => {
  const user = useContext(UserContext);

  const [events, updateEvents] = useState<TDayEvent[]>([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = DayEvent(user!).listenDayEvents(updateEvents);
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  const eventsComponents = events?.map((event: TDayEvent, index) => (
    <DayEventCard event={event} key={`${event.title}-${index}`} />
  ));

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "left",
        flexWrap: "wrap",
      }}
    >
      {/* <Button onClick={onClickHandler}>Get event</Button> */}
      {[<DayEventCard key={"newDayEventCard"} />, ...eventsComponents]}
    </Box>
  );
};

export default EventManager;
