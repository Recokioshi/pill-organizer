import { Box } from "@mui/material";
import React, { useCallback, useContext, useMemo } from "react";
import { EventGroup } from "../../../../api/hooks/eventGroups";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { UserContext } from "../../../app/App";
import { UserDataContext } from "../../Dashboard.component";
import { DayEventCard } from "../../eventManagement/dayEventCard/DayEventCard.component";

type ChildrenEventsListProps = {
  eventGroup: TEventGroup;
};

export const ChildrenEventsList: React.FC<ChildrenEventsListProps> = ({
  eventGroup,
}) => {
  const user = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const events = useMemo(() => userData?.events || [], [userData]);

  const handleEventFinish = useCallback(
    (eventId: string) => async () => {
      if (eventGroup.finishedEvents?.includes(eventId)) {
        await EventGroup(user!).removeFinishedEvent(eventGroup.id!, eventId);
      } else {
        await EventGroup(user!).addFinishedEvent(eventGroup.id!, eventId);
      }
    },
    [user, eventGroup]
  );

  const eventsComponents = useMemo(
    () =>
      events
        .filter(({ id: eventId }) =>
          eventGroup.childrenEvents?.find(({ id }) => id === eventId)
        )
        .map((event, index) => (
          <Box onClick={handleEventFinish(event.id!)}>
            <DayEventCard
              event={event}
              key={`${event.title}-${index}`}
              readonly
              finished={eventGroup.finishedEvents?.includes(event.id!)}
            />
          </Box>
        )),
    [
      eventGroup.childrenEvents,
      eventGroup.finishedEvents,
      events,
      handleEventFinish,
    ]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: 1,
      }}
    >
      {eventsComponents}
    </Box>
  );
};
