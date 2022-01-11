import { Box } from "@mui/system";
import React, { useContext, useMemo } from "react";
import { TDayEvent } from "../../../api/types/dayEvent";
import { DayEventCard } from "./dayEventCard/DayEventCard.component";
import { UserDataContext } from "../Dashboard.component";

const EventManager = () => {
  const userData = useContext(UserDataContext);
  const events = useMemo(() => userData?.events || [], [userData]);

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
