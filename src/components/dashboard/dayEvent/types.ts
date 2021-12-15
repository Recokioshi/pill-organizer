export enum DayEventType {
  Meal = 'meal',
  Pill = 'pill',
  Morning = 'morning',
  Evening = 'evening',
}

export interface DayEvent {
  type: DayEventType;
};

type DayEventComponentProps = {event: DayEvent};

export type DayEventComponent = React.FC<DayEventComponentProps>;