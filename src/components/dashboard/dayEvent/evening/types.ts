import { DayEvent, DayEventType } from "../types";

export interface EveningEvent extends DayEvent {
  type: DayEventType.Evening;
}

type EveningComponentProps = {
  event: EveningEvent;
};

export type EveningComponent = React.FC<EveningComponentProps>;