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
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { UserDataContext } from "../../Dashboard.component";
import { UserContext } from "../../../app/App";
import { EventGroup } from "../../../../api/hooks/eventGroups";

type EventGroupListProps = {
  groups: TEventGroup[];
  deleteHandler?: (group: TEventGroup) => () => void;
  openNextGroupHandler: (group: TEventGroup) => () => void;
};

const DEFAULT_OPEN_STATE = true;

export const EventGroupList: React.FC<EventGroupListProps> = ({
  deleteHandler,
  groups,
  openNextGroupHandler,
}) => {
  const user = useContext(UserContext);
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

  const handleEventFinish = useCallback(
    (eventGroup: TEventGroup, eventId: string) => async () => {
      if (eventGroup.finishedEvents?.includes(eventId)) {
        await EventGroup(user!).removeFinishedEvent(eventGroup.id!, eventId);
      } else {
        await EventGroup(user!).addFinishedEvent(eventGroup.id!, eventId);
      }
    },
    [user]
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

        const childrenEventsComponents =
          eventGroup.childrenEvents?.map(({ id }, index) => {
            const event = events.find(({ id: eventsId }) => eventsId === id);
            const finished = eventGroup.finishedEvents?.includes(id!);
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
              <ListItemButton
                sx={sx}
                key={`${event?.title}-${index}`}
                onClick={handleEventFinish(eventGroup, event?.id!)}
              >
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
          }) || null;

        return (
          <Box>
            <ListItem
              secondaryAction={
                (!hasChildGroups && !hasChildEvents && deleteHandler && (
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
                ))
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
                  {childrenEventsComponents}
                </List>
              </Collapse>
            )}
            <Divider />
          </Box>
        );
      }),
    [
      groups,
      deleteHandler,
      toggleOpenHandler,
      openMatrix,
      openNextGroupHandler,
      events,
      handleEventFinish,
    ]
  );
  console.log(openMatrix);
  return <List>{groupsComponents}</List>;
};
