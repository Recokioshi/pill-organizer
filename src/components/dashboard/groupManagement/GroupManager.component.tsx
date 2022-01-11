import { Box } from "@mui/material";
import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { EventGroup } from "../../../api/hooks/eventGroups";
import { TEventGroup } from "../../../api/types/eventGroup";
import { UserContext } from "../../app/App";
import { EventGroupCard } from "./eventGroup/EventGroupCard.component";
import EventGroupView from "./eventGroup/EventGroupView.component";

const GroupManagerComponent = () => {
  const user = useContext(UserContext);
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

  const [groups, updateGroups] = useState<TEventGroup[]>([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = EventGroup(user!).listenEventGroups(updateGroups);
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  const groupsComponents = useMemo(
    () =>
      groups?.map((eventGroup: TEventGroup, index) => (
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
        {[<EventGroupCard key={"newEventGroupCard"} />, ...groupsComponents]}
      </Box>
    );
  }, [groups, groupsComponents, groupsStack, handleReturnGroup]);

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
