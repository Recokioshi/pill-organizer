import { Box } from "@mui/material";
import { useContext, useState, useCallback, useMemo } from "react";
import { TEventGroup } from "../../../api/types/eventGroup";
import { UserDataContext } from "../Dashboard.component";
import { EventGroupCard } from "./eventGroup/EventGroupCard.component";
import EventGroupView from "./eventGroup/EventGroupView.component";

const GroupManagerComponent = () => {
  const userData = useContext(UserDataContext);
  const groups = useMemo(() => userData?.groups || [], [userData]);
  const [groupsStack, setGroupsStack] = useState<string[]>([]);
  console.log(groupsStack);
  const openNextGroup = useCallback(
    (nextGroup: TEventGroup) => {
      setGroupsStack([...groupsStack, nextGroup.id!]);
    },
    [groupsStack]
  );

  const handleReturnGroup = useCallback(() => {
    console.log("handleReturnGroup");
    setGroupsStack(groupsStack.length ? [...groupsStack].slice(0, -1) : []);
  }, [groupsStack]);

  const groupsComponents = useMemo(
    () =>
      groups
        ?.filter(({ master }) => master)
        .map((eventGroup: TEventGroup, index) => (
          <Box key={`${eventGroup.id}-${index}`}>
            <EventGroupCard
              eventGroup={eventGroup}
              openNextGroup={openNextGroup}
            />
          </Box>
        )),
    [groups, openNextGroup]
  );

  const componentToRender = useMemo(() => {
    console.log("rewrite componentToRender");
    return groupsStack.length ? (
      <EventGroupView
        eventGroup={
          groups.find(({ id }) => id === groupsStack[groupsStack.length - 1])!
        }
        handleReturnGroup={handleReturnGroup}
        handleNextGroup={openNextGroup}
      />
    ) : (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "left",
          flexWrap: "wrap",
        }}
      >
        {[
          <EventGroupCard key={"newEventGroupCard"} master />,
          ...groupsComponents,
        ]}
      </Box>
    );
  }, [groups, groupsComponents, groupsStack, handleReturnGroup, openNextGroup]);

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
