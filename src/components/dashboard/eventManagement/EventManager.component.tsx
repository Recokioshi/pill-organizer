import { Box } from "@mui/system";
import InfoIcon from "@mui/icons-material/Info";
import React, { useContext, useMemo } from "react";
import { TDayEvent } from "../../../api/types/dayEvent";
import { DayEventCard } from "./dayEventCard/DayEventCard.component";
import { UserDataContext } from "../Dashboard.component";
import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";

const EventManager = () => {
  const userData = useContext(UserDataContext);
  const events = useMemo(() => userData?.events || [], [userData]);

  const eventsComponents = events?.map((event: TDayEvent, index) => (
    <ImageListItem key={event.id}>
      <img
        src={`${event.imageUrl}`}
        width={140}
        height={140}
        alt={event.title}
        loading="lazy"
      />
      <ImageListItemBar
        title={event.title}
        subtitle={event.description}
        actionIcon={
          <IconButton
            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
            aria-label={`picture of ${event.title}`}
          >
            <InfoIcon />
          </IconButton>
        }
      />
    </ImageListItem>
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
      <ImageList sx={{ width: 1 }} cols={3}>
        {eventsComponents}
      </ImageList>
      <DayEventCard key={"newDayEventCard"} />
    </Box>
  );
};

export default EventManager;
