import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useCallback, useEffect, useState } from "react";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { EventsEditorComponent } from "./EventsEditor.component";
import { GroupsEditorComponent } from "./GroupEditor.component";
import { EventGroupCard } from "./EventGroupCard.component";

type EventGroupHeaderProps = {
  names: string[];
  handleReturnGroup: () => void;
};
const EventGroupHeader: React.FC<EventGroupHeaderProps> = ({
  names,
  handleReturnGroup,
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
    {!!names.length && (
      <Button onClick={handleReturnGroup}>
        <ArrowBackIcon />
      </Button>
    )}
    <Typography>{names.join(" > ")}</Typography>
    <div />
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
  eventGroup?: TEventGroup;
  groupNamesInStack: string[];
  handleReturnGroup: () => void;
};
const EventGroupView: React.FC<EventGroupViewProps> = ({
  eventGroup,
  groupNamesInStack,
  handleReturnGroup,
  children,
}) => {
  const [eventsManagerVisible, setEventsManagerVisible] = useState(false);
  const [groupsManagerVisible, setGroupsManagerVisible] = useState(false);

  useEffect(() => {
    setEventsManagerVisible(false);
    setGroupsManagerVisible(false);
  }, [eventGroup]);

  const onToggleEventsManager = useCallback(() => {
    setEventsManagerVisible(!eventsManagerVisible);
  }, [eventsManagerVisible]);
  const onToggleGroupsManager = useCallback(() => {
    setGroupsManagerVisible(!groupsManagerVisible);
  }, [groupsManagerVisible]);

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
            flexDirection: "column",
            flexWrap: "wrap",
            width: 1,
          }}
        >
          {children}
        </Box>
      </Box>
      {eventsManagerVisible && eventGroup && (
        <EventsEditorComponent eventGroup={eventGroup} />
      )}
      {groupsManagerVisible &&
        (eventGroup ? (
          <GroupsEditorComponent eventGroup={eventGroup} />
        ) : (
          <EventGroupCard key={"newEventGroupCard"} master />
        ))}
      <EventGroupFooter
        onManageChildEventsHandler={
          eventGroup && !eventGroup?.childrenGroups?.length
            ? onToggleEventsManager
            : null
        }
        onManageChildGroupsHandler={
          !eventGroup?.childrenEvents?.length || !eventGroup
            ? onToggleGroupsManager
            : null
        }
      />
    </Box>
  );
};

export default EventGroupView;
