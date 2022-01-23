import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EventGroup } from "../../../../api/hooks/eventGroups";
import { TEventGroup } from "../../../../api/types/eventGroup";
import { EventsEditorComponent } from "./EventsEditor.component";
import { GroupsEditorComponent } from "./GroupEditor.component";
import { EventGroupCard } from "./EventGroupCard.component";
import { UserContext } from "../../../app/App";

type EventGroupHeaderProps = {
  names: string[];
  handleReturnGroup: () => void;
  handleSetEdit: () => void;
  handleSave: (newName: string) => void;
  handleCancel: () => void;
  isEditMode: boolean;
};
const EventGroupHeader: React.FC<EventGroupHeaderProps> = ({
  names,
  handleReturnGroup,
  handleSetEdit,
  handleSave,
  handleCancel,
  isEditMode,
}) => {
  const previousNames = useMemo(
    () => names.slice(0, names.length - 1),
    [names]
  );
  const lastName = useMemo(() => names[names.length - 1] || "", [names]);

  const [currentGroupName, setCurrentGroupName] = useState("");

  useEffect(() => {
    setCurrentGroupName(lastName);
  }, [lastName]);

  const handleNameChange = useCallback((event) => {
    setCurrentGroupName(event.target.value);
  }, []);

  const handleSaveButtonClick = useCallback(() => {
    handleSave(`${currentGroupName}`);
  }, [currentGroupName, handleSave]);

  const handleCancelButtonClick = useCallback(() => {
    handleCancel();
  }, [handleCancel]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: 1,
      }}
    >
      {!!names.length && (
        <Button onClick={handleReturnGroup}>
          <ArrowBackIcon />
        </Button>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {!!previousNames.length && !isEditMode && (
          <Typography
            variant="subtitle1"
            sx={{
              marginRight: 1,
            }}
          >
            {previousNames.join(" > ")} {" > "}
          </Typography>
        )}
        {isEditMode ? (
          <TextField
            onChange={handleNameChange}
            value={currentGroupName}
            variant="standard"
          />
        ) : (
          <Typography variant="h4">{lastName}</Typography>
        )}
      </Box>
      {isEditMode ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={handleCancelButtonClick}>
            <CancelIcon />
          </IconButton>
          <IconButton color="primary" onClick={handleSaveButtonClick}>
            <SaveIcon />
          </IconButton>
        </Box>
      ) : (
        <IconButton onClick={handleSetEdit}>
          <EditIcon />
        </IconButton>
      )}
    </Box>
  );
};

type EventGroupFooterProps = {
  onManageChildEventsHandler: (() => void) | null;
  onManageChildGroupsHandler: (() => void) | null;
};
const EventGroupFooter: React.FC<EventGroupFooterProps> = ({
  onManageChildEventsHandler,
  onManageChildGroupsHandler,
}) => (
  <Box
    sx={{
      position: "fixed",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      bottom: 0,
      width: 1,
      bgcolor: "grey.400",
      paddingBottom: 2,
      paddingTop: 1,
    }}
  >
    {onManageChildEventsHandler && (
      <Button variant="outlined" onClick={onManageChildEventsHandler}>
        Manage pills
      </Button>
    )}
    {onManageChildGroupsHandler && (
      <Button variant="outlined" onClick={onManageChildGroupsHandler}>
        Manage child groups
      </Button>
    )}
  </Box>
);

type EventGroupViewProps = {
  eventGroup?: TEventGroup;
  groupNamesInStack: string[];
  handleReturnGroup: () => void;
};
const EventGroupView: React.FC<EventGroupViewProps> = ({
  eventGroup,
  groupNamesInStack,
  handleReturnGroup,
  children,
}) => {
  const user = useContext(UserContext);
  const [eventsManagerVisible, setEventsManagerVisible] = useState(false);
  const [groupsManagerVisible, setGroupsManagerVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  useEffect(() => {
    setEventsManagerVisible(false);
    setGroupsManagerVisible(false);
  }, [eventGroup]);

  const onToggleEventsManager = useCallback(() => {
    setEventsManagerVisible(!eventsManagerVisible);
  }, [eventsManagerVisible]);
  const onToggleGroupsManager = useCallback(() => {
    setGroupsManagerVisible(!groupsManagerVisible);
  }, [groupsManagerVisible]);

  const handleSetEdit = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditMode(false);
  }, []);

  const handleEditSave = useCallback(
    async (newName: string) => {
      await EventGroup(user!).update(eventGroup!.id!, { name: newName });
      setEditMode(false);
    },
    [eventGroup, user]
  );

  return (
    <Box
      sx={{
        display: "block",
        width: 1,
        height: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <EventGroupHeader
          names={groupNamesInStack}
          handleReturnGroup={handleReturnGroup}
          handleSetEdit={handleSetEdit}
          handleSave={handleEditSave}
          handleCancel={handleCancelEdit}
          isEditMode={isEditMode}
        />
      </Box>
      <Box
        sx={{
          marginBottom: 15,
          width: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            width: 1,
          }}
        >
          {children}
        </Box>
      </Box>
      {eventsManagerVisible && eventGroup && (
        <EventsEditorComponent eventGroup={eventGroup} />
      )}
      {groupsManagerVisible &&
        (eventGroup ? (
          <GroupsEditorComponent eventGroup={eventGroup} />
        ) : (
          <EventGroupCard key={"newEventGroupCard"} master />
        ))}
      <EventGroupFooter
        onManageChildEventsHandler={
          eventGroup && !eventGroup?.childrenGroups?.length
            ? onToggleEventsManager
            : null
        }
        onManageChildGroupsHandler={
          !eventGroup?.childrenEvents?.length || !eventGroup
            ? onToggleGroupsManager
            : null
        }
      />
    </Box>
  );
};

export default EventGroupView;
