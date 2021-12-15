import { Box } from "@mui/material";
import React from "react";
import EveningComponent from "./evening/Evening.component";
import MealComponent from "./meal/Meal.component";
import MorningComponent from "./morning/Morning.component";
import PillComponent from "./pill/Pill.component";
import {
  isMorningEvent,
  isEveningEvent,
  isMealEvent,
  isPillEvent,
} from "./typeguards";
import { DayEvent, DayEventComponent } from "./types";

const getComponentToRender = (event: DayEvent) => {
  if (isMorningEvent(event)) {
    return <MorningComponent event={event} />;
  }
  if (isEveningEvent(event)) {
    return <EveningComponent event={event} />;
  }
  if (isMealEvent(event)) {
    return <MealComponent event={event} />;
  }
  if (isPillEvent(event)) {
    return <PillComponent event={event} />;
  }
  throw new Error("Unknown event type");
};

const dayEventComponent: DayEventComponent = ({ event }) => {
  const componentToRender = getComponentToRender(event);

  return (
    <Box>
      <Box style={styles.container}>{componentToRender}</Box>
    </Box>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: 70,
  },
};

export default dayEventComponent;
