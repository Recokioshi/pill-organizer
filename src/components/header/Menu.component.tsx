import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useCallback } from "react";
import BlurCircularIcon from "@mui/icons-material/BlurCircular";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";

type MenuProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Menu: React.FC<MenuProps> = ({ open, setOpen }) => {
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Drawer anchor="left" open={open} onClose={handleClose}>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          <ListItem button>
            <ListItemIcon>
              <BlurCircularIcon />
            </ListItemIcon>
            <ListItemText primary="OPT1" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ViewTimelineIcon />
            </ListItemIcon>
            <ListItemText primary="OPT2" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Menu;
