import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { TEventGroup } from "../../../../api/types/eventGroup";

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

type EventGroupViewProps = {
  eventGroup: TEventGroup;
  handleReturnGroup: () => void;
};
const EventGroupView: React.FC<EventGroupViewProps> = ({
  eventGroup,
  handleReturnGroup,
}) => {
  return (
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
  );
};

export default EventGroupView;
