import { DayEvent, DayEventType } from "../../../components/dashboard/day/dayEvent/types";

export const getSampleDay = (): DayEvent[] => {
  return [
    {
      type: DayEventType.Morning,
    },
    {
      type: DayEventType.Pill,
    },
    {
      type: DayEventType.Pill,
    },
    {
      type: DayEventType.Meal,
    },
    {
      type: DayEventType.Pill,
    },
    {
      type: DayEventType.Pill,
    },
    {
      type: DayEventType.Meal,
    },
    {
      type: DayEventType.Pill,
    },
    {
      type: DayEventType.Pill,
    },
    {
      type: DayEventType.Meal,
    },
    {
      type: DayEventType.Pill,
    },
    {
      type: DayEventType.Pill,
    },
    {
      type: DayEventType.Evening, 
    }
  ];
};