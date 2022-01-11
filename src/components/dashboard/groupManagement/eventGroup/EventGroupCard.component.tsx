import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  CardActions,
} from "@mui/material";
import { useContext, useState, useCallback } from "react";
import { EventGroup } from "../../../../api/hooks/eventGroups";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { UserContext } from "../../../app/App";

type EventGroupProps = {
  eventGroup?: TEventGroup;
  openNextGroup?: (nextGroup: TEventGroup) => void;
};
export const EventGroupCard: React.FC<EventGroupProps> = ({
  eventGroup,
  openNextGroup,
}) => {
  const user = useContext(UserContext);
  const [name, setName] = useState(eventGroup?.name || "");
  const [description, setDescription] = useState(eventGroup?.description || "");
  const [childrenEvents, setChildredEvents] = useState([]);
  const [childrenGroups, setChildredGroups] = useState([]);
  const [effectiveTime, setEffectiveTime] = useState(
    eventGroup?.effectiveTime || ""
  );

  const upload = useCallback(async () => {
    await EventGroup(user!).setEventGroup({
      name,
      description,
      childrenEvents,
      childrenGroups,
      effectiveTime,
    });
    setName("");
    setDescription("");
    setChildredEvents([]);
    setChildredGroups([]);
    setEffectiveTime("");
  }, [childrenEvents, childrenGroups, description, effectiveTime, name, user]);

  const handleOpenNextGroup = useCallback(() => {
    console.log("handleOpenNextGroup");
    if (openNextGroup && eventGroup) {
      console.log("open");
      openNextGroup(eventGroup);
    }
  }, [eventGroup, openNextGroup]);

  const handleInputChange = useCallback(
    (valueSetter: React.Dispatch<React.SetStateAction<string>>) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        valueSetter(event.target.value);
      },
    []
  );

  const addCardHandler = useCallback(
    async (event) => {
      event.preventDefault();
      upload();
    },
    [upload]
  );

  const deleteCardHandler = useCallback(async () => {
    await EventGroup(user!).deleteEventGroup(eventGroup!.id!);
  }, [eventGroup, user]);

  return (
    <Box sx={{ padding: 2, maxWidth: 300 }}>
      <Card variant="outlined">
        <form onSubmit={addCardHandler}>
          <CardContent onClick={handleOpenNextGroup}>
            <Box
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              display="flex"
              flexDirection="column"
            >
              <TextField
                required
                id="name"
                label="Name"
                disabled={!!eventGroup}
                value={name}
                onInput={handleInputChange(setName)}
              />
              <TextField
                id="description"
                multiline
                disabled={!!eventGroup}
                rows={5}
                label="description"
                value={description}
                onInput={handleInputChange(setDescription)}
              />
              <TextField
                id="effectiveTime"
                label="Time of day"
                disabled={!!eventGroup}
                value={effectiveTime}
                onInput={handleInputChange(setEffectiveTime)}
              />
            </Box>
          </CardContent>

          <CardActions>
            {!eventGroup && (
              <Button type="submit" size="small">
                Add
              </Button>
            )}
            {eventGroup && (
              <Button size="small" onClick={deleteCardHandler}>
                Delete
              </Button>
            )}
          </CardActions>
        </form>
      </Card>
    </Box>
  );
};
