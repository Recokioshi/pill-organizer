import { DayEvent, DayEventType } from "../types";

export interface PillEvent extends DayEvent {
  type: DayEventType.Pill;
}

type PillComponentProps = {
  event: PillEvent;
};

export type PillComponent = React.FC<PillComponentProps>;