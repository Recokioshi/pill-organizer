import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import React, { useContext, useMemo } from "react";
import { EventGroup } from "../../../../api/hooks/eventGroups";
import { TDayEvent } from "../../../../api/types/dayEvent";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { UserDataContext } from "../../Dashboard.component";
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
}) => (
  <Box
    sx={{
      display: "flex",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      padding: 1,
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "grey.300",
      },
    }}
    onClick={eventSelectHandler}
  >
    <img
      src={event?.imageUrl}
      width={50}
      height={50}
      alt={`${event?.title}-thumbnail`}
    />
    <Typography variant="h6">
      {event?.title}
      {isIncluded ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon />}
    </Typography>
  </Box>
);

type EventsEditorComponentProps = {
  eventGroup: TEventGroup;
};

export const EventsEditorComponent: React.FC<EventsEditorComponentProps> = ({
  eventGroup,
}) => {
  const user = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const events = useMemo(() => userData?.events || [], [userData]);

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
        position: "fixed",
        bottom: 50,
        padding: 3,
        display: "flex",
        width: "100%",
        flexDirection: "column",
        backgroundColor: "grey.200",
      }}
    >
      {eventsComponents}
    </Box>
  );
};
