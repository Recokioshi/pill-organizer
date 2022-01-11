import { Box, Button, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { EventGroup } from "../../../../api/hooks/eventGroups";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { UserDataContext } from "../../Dashboard.component";
import { UserContext } from "../../../app/App";

type NewSubgroupRowProps = {
  handleAddSubgroup: (subgroupName: string) => void;
};

const NewSubgroupRow: React.FC<NewSubgroupRowProps> = ({
  handleAddSubgroup,
}) => {
  const [subgroupName, setSubgroupName] = useState("");

  const handleInputChange = useCallback(
    (valueSetter: React.Dispatch<React.SetStateAction<string>>) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        valueSetter(event.target.value);
      },
    []
  );

  const handleAddSubgroupClick = useCallback(() => {
    handleAddSubgroup(subgroupName);
    setSubgroupName("");
  }, [handleAddSubgroup, subgroupName]);

  return (
    <Box
      sx={{
        display: "flex",
        width: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        padding: 1,
      }}
    >
      <TextField
        required
        id="name"
        label="Name"
        disabled={false}
        value={subgroupName}
        onInput={handleInputChange(setSubgroupName)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddSubgroupClick}
      >
        <AddIcon />
      </Button>
    </Box>
  );
};

type GroupRowProps = {
  group?: TEventGroup;
  isIncluded: boolean;
  deleteGroupHandler: () => void;
};

const GroupRow: React.FC<GroupRowProps> = ({
  group,
  isIncluded,
  deleteGroupHandler,
}) => {
  console.log("isIncluded", isIncluded);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        padding: 1,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "grey.300",
        },
      }}
    >
      <Typography variant="h6">{group?.name}</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={deleteGroupHandler}
        startIcon={<DeleteIcon />}
      ></Button>
    </Box>
  );
};

type GroupsEditorComponentProps = {
  eventGroup: TEventGroup;
};

export const GroupsEditorComponent: React.FC<GroupsEditorComponentProps> = ({
  eventGroup,
}) => {
  const user = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const groups = useMemo(() => userData?.groups || [], [userData]);

  const handleAddSubgroup = async (subgroupName: string) => {
    await EventGroup(user!).addGroupToGroup(eventGroup.id!, subgroupName);
  };

  const handleDeleteSubgroup = (subgroupId: string) => async () => {
    await EventGroup(user!).removeGroupFromGroup(eventGroup.id!, subgroupId);
  };

  const groupsComponents = groups
    ?.filter(
      ({ id }) =>
        id !== eventGroup?.id &&
        eventGroup?.childrenGroups?.find(
          ({ id: childrenId }) => childrenId === id
        )
    )
    .map((group: TEventGroup, index) => (
      <GroupRow
        group={group}
        key={`${group.name}-${index}`}
        isIncluded={
          eventGroup.childrenGroups?.some(({ id }) => id === group.id) || false
        }
        deleteGroupHandler={handleDeleteSubgroup(group?.id!)}
      />
    ));

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 50,
        padding: 3,
        display: "flex",
        width: "100%",
        flexDirection: "column",
        backgroundColor: "grey.200",
      }}
    >
      {[
        ...groupsComponents,
        <NewSubgroupRow
          key="new-subgroup"
          handleAddSubgroup={handleAddSubgroup}
        />,
      ]}
    </Box>
  );
};
