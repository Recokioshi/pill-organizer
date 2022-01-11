import { Box, Button, Typography } from "@mui/material";
import React, { useContext, useMemo, useState } from "react";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { UserDataContext } from "../../Dashboard.component";
import { DayEventCard } from "../../eventManagement/dayEventCard/DayEventCard.component";
import { EventsEditorComponent } from "./EventsEditor.component";
import { GroupsEditorComponent } from "./GroupEditor.component";

type EventGroupHeaderProps = {
  name: string;
  handleReturnGroup: () => void;
};
const EventGroupHeader: React.FC<EventGroupHeaderProps> = ({
  name,
  handleReturnGroup,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Button onClick={handleReturnGroup}>Back</Button>
    <Typography>{name}</Typography>
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
      height: 50,
      bgcolor: "grey.400",
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
      bottom: 50,
      width: 1,
      height: 50,
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
  handleReturnGroup: () => void;
  handleNextGroup: (nextGroup: TEventGroup) => void;
};
const EventGroupView: React.FC<EventGroupViewProps> = ({
  eventGroup,
  handleReturnGroup,
  handleNextGroup,
}) => {
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
      <DayEventCard event={event} key={`${event.title}-${index}`} readonly />
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
          name={eventGroup.name}
          handleReturnGroup={handleReturnGroup}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {eventsComponents}
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
