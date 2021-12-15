import { DayEvent } from "./dayEvent/types";

type DayComponentProps = {
  events: DayEvent[],
};

export type DayComponent = React.FC<DayComponentProps>;