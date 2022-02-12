import {
  Box,
  ListItem,
  IconButton,
  ListItemButton,
  ListItemText,
  Divider,
  List,
  Collapse,
  ListItemIcon,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MedicationIcon from "@mui/icons-material/Medication";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { UserDataContext } from "../../Dashboard.component";
import { UserContext } from "../../../app/App";
import { EventGroup } from "../../../../api/hooks/eventGroups";
import { TDayEvent } from "../../../../api/types/dayEvent";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { User } from "firebase/auth";

const DEFAULT_OPEN_STATE = true;

type ChildrenEventComponentProps = {
  event: TDayEvent;
  finished: boolean;
  handleEventFinish: () => void;
};
const ChildrenEventComponent: React.FC<ChildrenEventComponentProps> = ({
  event,
  finished,
  handleEventFinish,
}) => {
  const sx = finished
    ? {
        pl: 4,
        backgroundColor: "success.light",
        "&:hover": {
          backgroundColor: "success.main",
        },
      }
    : {
        pl: 4,
      };
  return (
    <ListItemButton sx={sx} key={`${event?.title}`} onClick={handleEventFinish}>
      {event?.imageUrl ? (
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={event.imageUrl} />
        </ListItemAvatar>
      ) : (
        <ListItemIcon>
          <MedicationIcon />
        </ListItemIcon>
      )}

      <ListItemText primary={event?.title} />
    </ListItemButton>
  );
};

type ChildrenEventsComponentsProps = {
  eventGroup: TEventGroup;
  events: TDayEvent[];
  user: User;
};
const childrenEventsComponents = ({
  user,
  eventGroup,
  events,
}: ChildrenEventsComponentsProps): ReactJSXElement[] => {
  const handleEventFinish =
    (eventGroup: TEventGroup, eventId: string) => async () => {
      if (eventGroup.finishedEvents?.includes(eventId)) {
        await EventGroup(user!).removeFinishedEvent(eventGroup.id!, eventId);
      } else {
        await EventGroup(user!).addFinishedEvent(eventGroup.id!, eventId);
      }
    };

  return (
    eventGroup.childrenEvents?.map(({ id }) => {
      const event = events.find(({ id: eventsId }) => eventsId === id);
      const finished = eventGroup.finishedEvents?.includes(id!) || false;
      return (
        <ChildrenEventComponent
          key={event?.id}
          event={event!}
          finished={finished}
          handleEventFinish={handleEventFinish(eventGroup, event?.id!)}
        />
      );
    }) || []
  );
};

type EventGroupListProps = {
  groups: TEventGroup[];
  deleteHandler?: (group: TEventGroup) => () => void;
  openNextGroupHandler: (group: TEventGroup) => () => void;
  moveUpHandler?: ((group: TEventGroup) => () => void) | null;
  moveDownHandler?: ((group: TEventGroup) => () => void) | null;
};
export const EventGroupList: React.FC<EventGroupListProps> = ({
  deleteHandler,
  groups,
  openNextGroupHandler,
  moveUpHandler,
  moveDownHandler,
}) => {
  const user = useContext(UserContext) as User;

  const userData = useContext(UserDataContext);
  const events = useMemo(() => userData?.events || [], [userData]);
  const [openMatrix, setOpenMatrix] = React.useState<Record<string, boolean>>(
    {}
  );

  const setOpenForGroup = useCallback(
    (groupId: string, openState: boolean) => {
      setOpenMatrix({ ...openMatrix, [groupId]: openState });
    },
    [openMatrix]
  );

  const toggleOpenHandler = useCallback(
    (groupId: string) => () => {
      setOpenForGroup(groupId, !openMatrix[groupId]);
    },
    [openMatrix, setOpenForGroup]
  );

  useEffect(() => {
    const newMatrix = groups.reduce<Record<string, boolean>>(
      (acc, { id }) => {
        acc[id!] = DEFAULT_OPEN_STATE;
        return acc;
      },
      {
        initialized: true,
      }
    );
    setOpenMatrix(newMatrix);
  }, [groups]);

  const groupsComponents = useMemo(
    () =>
      groups.map((eventGroup: TEventGroup, index) => {
        const hasChildEvents = !!eventGroup.childrenEvents?.length;
        const hasChildGroups = !!eventGroup.childrenGroups?.length;

        const childrenEvents = childrenEventsComponents({
          eventGroup,
          events,
          user,
        });

        return (
          <Box key={`${eventGroup.name}-${index}`}>
            <ListItem
              secondaryAction={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {(!hasChildGroups && !hasChildEvents && deleteHandler && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={deleteHandler(eventGroup)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )) ||
                    (hasChildEvents && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={toggleOpenHandler(eventGroup.id!)}
                      >
                        {openMatrix[eventGroup.id!] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    ))}
                  {moveUpHandler && index > 0 && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={moveUpHandler(eventGroup)}
                    >
                      <ArrowUpwardIcon />
                    </IconButton>
                  )}
                  {moveDownHandler && index < groups.length - 1 && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={moveDownHandler(eventGroup)}
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  )}
                </Box>
              }
            >
              <ListItemButton
                key={`${eventGroup.id}-${index}`}
                onClick={openNextGroupHandler(eventGroup)}
              >
                <ListItemText primary={eventGroup.name} />
              </ListItemButton>
            </ListItem>
            {hasChildEvents && (
              <Collapse
                in={openMatrix[eventGroup.id!]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {childrenEvents}
                </List>
              </Collapse>
            )}
            <Divider />
          </Box>
        );
      }),
    [
      groups,
      events,
      user,
      moveUpHandler,
      moveDownHandler,
      deleteHandler,
      toggleOpenHandler,
      openMatrix,
      openNextGroupHandler,
    ]
  );
  return <List>{groupsComponents}</List>;
};
