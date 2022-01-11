import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { EventsEditorComponent } from "./EventsEditor.component";

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
      bottom: 10,
      width: 1,
      bgcolor: "gray.1",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: 1,
      }}
    >
      <Button variant="outlined" onClick={onManageChildEventsHandler}>
        Manage pills
      </Button>
      <Button variant="outlined" onClick={onManageChildGroupsHandler}>
        Manage child groups
      </Button>
    </Box>
  </Box>
);

type EventGroupViewProps = {
  eventGroup: TEventGroup;
  handleReturnGroup: () => void;
};
const EventGroupView: React.FC<EventGroupViewProps> = ({
  eventGroup,
  handleReturnGroup,
}) => {
  const [eventsManagerVisible, setEventsManagerVisible] = useState(false);
  const [groupsManagerVisible, setGroupsManagerVisible] = useState(false);

  const onToggleEventsManager = () => {
    setEventsManagerVisible(!eventsManagerVisible);
  };
  const onToggleGroupsManager = () => {
    setGroupsManagerVisible(!groupsManagerVisible);
  };

  const eventsComponents = eventGroup.childrenEvents?.map((event) => (
    <Box
      sx={{
        width: 1,
        height: 20,
      }}
    >
      {event.id}
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
          name={eventGroup.name}
          handleReturnGroup={handleReturnGroup}
        />
      </Box>
      <EventGroupFooter
        onManageChildEventsHandler={onToggleEventsManager}
        onManageChildGroupsHandler={onToggleGroupsManager}
      />
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
    </Box>
  );
};

export default EventGroupView;
