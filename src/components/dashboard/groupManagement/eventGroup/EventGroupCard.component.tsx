import { Box, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useState, useCallback } from "react";
import { EventGroup } from "../../../../api/hooks/eventGroups";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { UserContext } from "../../../app/App";

type EventGroupProps = {
  eventGroup?: TEventGroup;
  master?: boolean;
};
export const EventGroupCard: React.FC<EventGroupProps> = ({
  eventGroup,
  master = false,
}) => {
  const user = useContext(UserContext);
  const [name, setName] = useState(eventGroup?.name || "");

  const upload = useCallback(async () => {
    await EventGroup(user!).set({
      name,
      description: "",
      effectiveTime: "",
      master,
    });
    setName("");
  }, [master, name, user]);

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

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 50,
        padding: 3,
        display: "flex",
        width: 1,
        flexDirection: "column",
        backgroundColor: "grey.200",
      }}
    >
      <form onSubmit={addCardHandler}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: 1,
            justifyContent: "space-evenly",
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
        >
          <TextField
            required
            id="name"
            label="Name"
            disabled={!!eventGroup}
            value={name}
            onInput={handleInputChange(setName)}
          />
          <Button type="submit" size="small">
            <AddIcon />
          </Button>
        </Box>
      </form>
    </Box>
  );
};
