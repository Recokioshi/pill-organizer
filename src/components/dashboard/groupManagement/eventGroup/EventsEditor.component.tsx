import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import React, { useContext, useEffect, useState } from "react";
import { DayEvent } from "../../../../api/hooks/dayEvents";
import { EventGroup } from "../../../../api/hooks/eventGroups";
import { TDayEvent } from "../../../../api/types/dayEvent";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { UserContext } from "../../../app/App";

type EventRowProps = {
  event?: TDayEvent;
  isIncluded: boolean;
  eventSelectHandler: () => void;
};

const EventRow: React.FC<EventRowProps> = ({
  event,
  isIncluded,
  eventSelectHandler,
}) => {
  console.log("isIncluded", isIncluded);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
      onClick={eventSelectHandler}
    >
      <img
        src={event?.imageUrl}
        height={50}
        alt={`${event?.title}-thumbnail`}
      />
      <Typography variant="h6">
        {event?.title}
        {isIncluded ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon />}
      </Typography>
    </Box>
  );
};

type EventsEditorComponentProps = {
  eventGroup: TEventGroup;
};

export const EventsEditorComponent: React.FC<EventsEditorComponentProps> = ({
  eventGroup,
}) => {
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

  const handleEventSelect = (eventId: string) => async () => {
    if (eventGroup.childrenEvents?.some(({ id }) => id === eventId)) {
      await EventGroup(user!).removeEventFromGroup(eventGroup.id!, eventId);
    } else {
      await EventGroup(user!).addEventToGroup(eventGroup.id!, eventId);
    }
  };

  const eventsComponents = events?.map((event: TDayEvent, index) => (
    <EventRow
      event={event}
      key={`${event.title}-${index}`}
      isIncluded={
        eventGroup.childrenEvents?.some(({ id }) => id === event.id) || false
      }
      eventSelectHandler={handleEventSelect(event?.id!)}
    />
  ));

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
      }}
    >
      {eventsComponents}
    </Box>
  );
};
