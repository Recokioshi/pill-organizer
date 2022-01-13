import { Box } from "@mui/material";
import { useContext, useState, useCallback, useMemo } from "react";
import { EventGroup } from "../../../api/hooks/eventGroups";
import { TEventGroup } from "../../../api/types/eventGroup";
import { UserContext } from "../../app/App";
import { UserDataContext } from "../Dashboard.component";
import { EventGroupCard } from "./eventGroup/EventGroupCard.component";
import EventGroupView from "./eventGroup/EventGroupView.component";
import { EventGroupList } from "./eventGroup/EventGroupList.component";

const GroupManagerComponent = () => {
  const user = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const groups = useMemo(() => userData?.groups || [], [userData]);
  const [groupsStack, setGroupsStack] = useState<string[]>([]);

  const groupNamesInStack = useMemo(
    () =>
      groupsStack.map(
        (groupId) => groups.find(({ id }) => groupId === id)?.name || "unknown"
      ),
    [groupsStack, groups]
  );

  const openNextGroup = useCallback(
    (nextGroup: TEventGroup) => () => {
      setGroupsStack([...groupsStack, nextGroup.id!]);
    },
    [groupsStack]
  );

  const handleReturnGroup = useCallback(() => {
    setGroupsStack(groupsStack.length ? [...groupsStack].slice(0, -1) : []);
  }, [groupsStack]);

  const deleteCardHandler = useCallback(
    (eventGroup) => async () => {
      await EventGroup(user!).deleteEventGroup(eventGroup!.id!);
    },
    [user]
  );

  const groupsToDisplay = useMemo(
    () => groups?.filter(({ master }) => master),
    [groups]
  );

  const componentToRender = useMemo(() => {
    return groupsStack.length ? (
      <EventGroupView
        eventGroup={
          groups.find(({ id }) => id === groupsStack[groupsStack.length - 1])!
        }
        groupNamesInStack={groupNamesInStack}
        handleReturnGroup={handleReturnGroup}
        handleNextGroup={openNextGroup}
        deleteHandler={deleteCardHandler}
      />
    ) : (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "left",
          flexWrap: "wrap",
          flexDirection: "column",
        }}
      >
        <EventGroupList
          groups={groupsToDisplay}
          deleteHandler={deleteCardHandler}
          openNextGroupHandler={openNextGroup}
        />
        <EventGroupCard key={"newEventGroupCard"} master />
      </Box>
    );
  }, [
    deleteCardHandler,
    groupNamesInStack,
    groups,
    groupsStack,
    groupsToDisplay,
    handleReturnGroup,
    openNextGroup,
  ]);

  return (
    <Box
      sx={{
        width: 1,
        height: 1,
      }}
    >
      {componentToRender}
    </Box>
  );
};

export default GroupManagerComponent;
