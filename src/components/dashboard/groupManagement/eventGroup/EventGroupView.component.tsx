import { Box, Button, Typography } from "@mui/material";
import React, { useContext, useMemo, useState } from "react";
import { EventGroup } from "../../../../api/hooks/eventGroups";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { UserContext } from "../../../app/App";
import { UserDataContext } from "../../Dashboard.component";
import { DayEventCard } from "../../eventManagement/dayEventCard/DayEventCard.component";
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
    <Button onClick={handleReturnGroup}>Back</Button>
    <Typography>{names.join(" > ")}</Typography>
    <Button onClick={handleReset}>Reset</Button>
  </Box>
);

type EventGroupFooterProps = {
  onManageChildEventsHandler: () => void;
  onManageChildGroupsHandler: () => void;
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
    <Button variant="outlined" onClick={onManageChildEventsHandler}>
      Manage pills
    </Button>
    <Button variant="outlined" onClick={onManageChildGroupsHandler}>
      Manage child groups
    </Button>
  </Box>
);

type SubGroupsListProps = {
  groups: TEventGroup[];
  handleGroupSelect: (group: TEventGroup) => void;
};

const SubGroupsList: React.FC<SubGroupsListProps> = ({
  groups,
  handleGroupSelect,
}) => (
  <Box
    sx={{
      position: "fixed",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      flexWrap: "wrap",
      bottom: 57,
      width: 1,
      bgcolor: "grey.100",
    }}
  >
    {groups.map((group) => (
      <Button key={group.id} onClick={() => handleGroupSelect(group)}>
        {group.name}
      </Button>
    ))}
  </Box>
);

type EventGroupViewProps = {
  eventGroup: TEventGroup;
  groupNamesInStack: string[];
  handleReturnGroup: () => void;
  handleNextGroup: (nextGroup: TEventGroup) => void;
};
const EventGroupView: React.FC<EventGroupViewProps> = ({
  eventGroup,
  groupNamesInStack,
  handleReturnGroup,
  handleNextGroup,
}) => {
  const user = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const events = useMemo(() => userData?.events || [], [userData]);
  const groups = useMemo(() => userData?.groups || [], [userData]);
  const [eventsManagerVisible, setEventsManagerVisible] = useState(false);
  const [groupsManagerVisible, setGroupsManagerVisible] = useState(false);

  const onToggleEventsManager = () => {
    setEventsManagerVisible(!eventsManagerVisible);
  };
  const onToggleGroupsManager = () => {
    setGroupsManagerVisible(!groupsManagerVisible);
  };

  const handleEventFinish = (eventId: string) => async () => {
    if (eventGroup.finishedEvents?.includes(eventId)) {
      await EventGroup(user!).removeFinishedEvent(eventGroup.id!, eventId);
    } else {
      await EventGroup(user!).addFinishedEvent(eventGroup.id!, eventId);
    }
  };

  const handleResetFinished = async () => {
    await EventGroup(user!).resetFinishedEvents(eventGroup.id!);
  };

  const childrenGroups: TEventGroup[] = useMemo(
    () =>
      (eventGroup.childrenGroups
        ?.map((groupRef) => groups.find((group) => group.id === groupRef.id))
        .filter((group) => !!group) as TEventGroup[]) || [],
    [eventGroup.childrenGroups, groups]
  );

  const eventsComponents = events
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
    ));

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
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {eventsComponents}
        </Box>
      </Box>
      {eventsManagerVisible && (
        <EventsEditorComponent eventGroup={eventGroup} />
      )}
      {groupsManagerVisible && (
        <GroupsEditorComponent eventGroup={eventGroup} />
      )}
      {!eventsManagerVisible && !groupsManagerVisible && (
        <SubGroupsList
          groups={childrenGroups}
          handleGroupSelect={handleNextGroup}
        />
      )}
      <EventGroupFooter
        onManageChildEventsHandler={onToggleEventsManager}
        onManageChildGroupsHandler={onToggleGroupsManager}
      />
    </Box>
  );
};

export default EventGroupView;
