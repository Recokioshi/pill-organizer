import { DayEvent, DayEventType } from "../types";

export interface MorningEvent extends DayEvent {
  type: DayEventType.Morning;
}

type MorningComponentProps = {
  event: MorningEvent;
};

export type MorningComponent = React.FC<MorningComponentProps>;