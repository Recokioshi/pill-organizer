import { Box } from "@mui/material";
import { useContext, useState, useCallback, useMemo } from "react";
import { EventGroup } from "../../../api/hooks/eventGroups";
import { TEventGroup } from "../../../api/types/eventGroup";
import { UserContext } from "../../app/App";
import { UserDataContext } from "../Dashboard.component";
import EventGroupView from "./eventGroup/EventGroupView.component";
import { EventGroupList } from "./eventGroup/EventGroupList.component";
import { ChildrenEventsList } from "./eventGroup/ChildrenEventsList.component";

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
      await EventGroup(user!).remove(eventGroup!.id!);
    },
    [user]
  );

  const masterGroups = useMemo(
    () => groups?.filter(({ master }) => master),
    [groups]
  );

  const groupToDisplay = useMemo(
    () => groups.find(({ id }) => id === groupsStack[groupsStack.length - 1]),
    [groups, groupsStack]
  );
  const childrenGroups: TEventGroup[] = useMemo(
    () =>
      groupToDisplay
        ? (groupToDisplay.childrenGroups
            ?.map((groupRef) =>
              groups.find((group) => group.id === groupRef.id)
            )
            .filter((group) => !!group) as TEventGroup[]) || []
        : masterGroups,
    [groupToDisplay, groups, masterGroups]
  );

  const componentToRender = useMemo(() => {
    return (
      <EventGroupView
        eventGroup={groupToDisplay}
        groupNamesInStack={groupNamesInStack}
        handleReturnGroup={handleReturnGroup}
      >
        {groupToDisplay && <ChildrenEventsList eventGroup={groupToDisplay} />}
        <EventGroupList
          groups={childrenGroups}
          openNextGroupHandler={openNextGroup}
          deleteHandler={deleteCardHandler}
        />
      </EventGroupView>
    );
  }, [
    groupNamesInStack,
    handleReturnGroup,
    groupToDisplay,
    childrenGroups,
    openNextGroup,
    deleteCardHandler,
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
