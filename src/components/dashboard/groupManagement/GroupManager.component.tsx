import { Box } from "@mui/material";
import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { EventGroup } from "../../../api/hooks/eventGroups";
import { TEventGroup } from "../../../api/types/eventGroup";
import { UserContext } from "../../app/App";
import { EventGroupCard } from "./eventGroup/EventGroupCard.component";
import EventGroupView from "./eventGroup/EventGroupView.component";

const GroupManagerComponent = () => {
  const user = useContext(UserContext);
  const [groupsStack, setGroupsStack] = useState<TEventGroup[]>([]);
  console.log(groupsStack);
  const handleOpenNextGroup = useCallback(
    (nextGroup: TEventGroup) => () => {
      setGroupsStack([...groupsStack, nextGroup]);
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
        <Box
          key={`${eventGroup.id}-${index}`}
          onClick={handleOpenNextGroup(eventGroup)}
        >
          <EventGroupCard eventGroup={eventGroup} />
        </Box>
      )),
    [groups, handleOpenNextGroup]
  );

  const componentToRender = useMemo(
    () =>
      groupsStack.length ? (
        <EventGroupView
          eventGroup={groupsStack[groupsStack.length - 1]}
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
          {[<EventGroupCard />, ...groupsComponents]}
        </Box>
      ),
    [groupsComponents, groupsStack, handleReturnGroup]
  );

  return <Box>{componentToRender}</Box>;
};

export default GroupManagerComponent;
