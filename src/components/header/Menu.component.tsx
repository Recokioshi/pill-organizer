import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { MouseEventHandler, useCallback } from "react";
import BlurCircularIcon from "@mui/icons-material/BlurCircular";
//import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { PAGES } from "./constants";

type MenuProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setPage: (nextPage: keyof typeof PAGES) => void;
};

const Menu: React.FC<MenuProps> = ({ open, setOpen, setPage }) => {
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const getEventHandlerForSetPage = useCallback<
    (nextPage: keyof typeof PAGES) => MouseEventHandler
  >(
    (nextPage) => () => {
      setPage(nextPage);
      setOpen(false);
    },
    [setOpen, setPage]
  );

  return (
    <Drawer anchor="left" open={open} onClose={handleClose}>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          <ListItem
            button
            onClick={getEventHandlerForSetPage(PAGES.EVENT_MANAGER)}
          >
            <ListItemIcon>
              <BlurCircularIcon />
            </ListItemIcon>
            <ListItemText primary="Pills" />
          </ListItem>
          <ListItem
            button
            onClick={getEventHandlerForSetPage(PAGES.GROUP_MANAGER)}
          >
            <ListItemIcon>
              <GroupWorkIcon />
            </ListItemIcon>
            <ListItemText primary="Groups" />
          </ListItem>
          {/* <ListItem button onClick={getEventHandlerForSetPage(PAGES.DAY)}>
            <ListItemIcon>
              <ViewTimelineIcon />
            </ListItemIcon>
            <ListItemText primary="Day" />
          </ListItem> */}
        </List>
      </Box>
    </Drawer>
  );
};

export default Menu;
