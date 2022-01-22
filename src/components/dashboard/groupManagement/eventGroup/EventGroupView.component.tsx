import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { EventGroup } from "../../../../api/hooks/eventGroups";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { UserContext } from "../../../app/App";
import { UserDataContext } from "../../Dashboard.component";
import { DayEventCard } from "../../eventManagement/dayEventCard/DayEventCard.component";
import { EventGroupList } from "./EventGroupList.component";
import { EventsEditorComponent } from "./EventsEditor.component";
import { GroupsEditorComponent } from "./GroupEditor.component";

type EventGroupHeaderProps = {
  names: string[];
  handleReturnGroup: () => void;
  handleReset: () => void;
};
const EventGroupHeader: React.FC<EventGroupHeaderProps> = ({
  names,
  handleReturnGroup,
  handleReset,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: 1,
    }}
  >
    <Button onClick={handleReturnGroup}>
      <ArrowBackIcon />
    </Button>
    <Typography>{names.join(" > ")}</Typography>
    <Button onClick={handleReset}>
      <RestartAltIcon />
    </Button>
  </Box>
);

type EventGroupFooterProps = {
  onManageChildEventsHandler: (() => void) | null;
  onManageChildGroupsHandler: (() => void) | null;
};
const EventGroupFooter: React.FC<EventGroupFooterProps> = ({
  onManageChildEventsHandler,
  onManageChildGroupsHandler,
}) => (
  <Box
    sx={{
      position: "fixed",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      bottom: 0,
      width: 1,
      bgcolor: "grey.400",
      paddingBottom: 2,
      paddingTop: 1,
    }}
  >
    {onManageChildEventsHandler && (
      <Button variant="outlined" onClick={onManageChildEventsHandler}>
        Manage pills
      </Button>
    )}
    {onManageChildGroupsHandler && (
      <Button variant="outlined" onClick={onManageChildGroupsHandler}>
        Manage child groups
      </Button>
    )}
  </Box>
);

type EventGroupViewProps = {
  eventGroup: TEventGroup;
  groupNamesInStack: string[];
  handleReturnGroup: () => void;
  handleNextGroup: (nextGroup: TEventGroup) => () => void;
  deleteHandler: (nextGroup: TEventGroup) => () => void;
};
const EventGroupView: React.FC<EventGroupViewProps> = ({
  eventGroup,
  groupNamesInStack,
  handleReturnGroup,
  handleNextGroup,
  deleteHandler,
}) => {
  const user = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const events = useMemo(() => userData?.events || [], [userData]);
  const groups = useMemo(() => userData?.groups || [], [userData]);
  const [eventsManagerVisible, setEventsManagerVisible] = useState(false);
  const [groupsManagerVisible, setGroupsManagerVisible] = useState(false);

  const onToggleEventsManager = useCallback(() => {
    setEventsManagerVisible(!eventsManagerVisible);
  }, [eventsManagerVisible]);
  const onToggleGroupsManager = useCallback(() => {
    setGroupsManagerVisible(!groupsManagerVisible);
  }, [groupsManagerVisible]);

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

  const handleResetFinished = useCallback(async () => {
    await EventGroup(user!).resetFinishedEvents(eventGroup.id!);
  }, [user, eventGroup]);

  const childrenGroups: TEventGroup[] = useMemo(
    () =>
      (eventGroup.childrenGroups
        ?.map((groupRef) => groups.find((group) => group.id === groupRef.id))
        .filter((group) => !!group) as TEventGroup[]) || [],
    [eventGroup.childrenGroups, groups]
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
        display: "block",
        width: 1,
        height: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <EventGroupHeader
          names={groupNamesInStack}
          handleReturnGroup={handleReturnGroup}
          handleReset={handleResetFinished}
        />
      </Box>
      <Box
        sx={{
          marginBottom: 15,
          width: 1,
        }}
      >
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            width: 1,
          }}
        >
          <EventGroupList
            groups={childrenGroups}
            openNextGroupHandler={handleNextGroup}
            deleteHandler={deleteHandler}
          />
        </Box>
      </Box>
      {eventsManagerVisible && (
        <EventsEditorComponent eventGroup={eventGroup} />
      )}
      {groupsManagerVisible && (
        <GroupsEditorComponent eventGroup={eventGroup} />
      )}
      <EventGroupFooter
        onManageChildEventsHandler={
          !eventGroup?.childrenGroups?.length ? onToggleEventsManager : null
        }
        onManageChildGroupsHandler={
          !eventGroup?.childrenEvents?.length ? onToggleGroupsManager : null
        }
      />
    </Box>
  );
};

export default EventGroupView;
