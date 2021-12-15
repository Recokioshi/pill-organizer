import { DayEvent, DayEventType } from "../types";

export interface MealEvent extends DayEvent {
  type: DayEventType.Meal;
}

type MealComponentProps = {
  event: MealEvent;
};

export type MealComponent = React.FC<MealComponentProps>;