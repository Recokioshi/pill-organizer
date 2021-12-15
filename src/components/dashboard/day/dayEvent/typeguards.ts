import { EveningEvent } from "./evening/types";
import { MealEvent } from "./meal/types";
import { MorningEvent } from "./morning/types";
import { PillEvent } from "./pill/types";
import { DayEvent, DayEventType } from "./types";

const isDayEvent = (event: any): event is DayEvent => {
  return typeof event.type !== 'undefined' && event.type !== '';
}

export const isMorningEvent = (event: DayEvent): event is MorningEvent => {
  return isDayEvent(event) && event.type === DayEventType.Morning;
}

export const isEveningEvent = (event: DayEvent): event is EveningEvent => {
  return isDayEvent(event) && event.type === DayEventType.Evening;
}

export const isMealEvent = (event: DayEvent): event is MealEvent => {
  return isDayEvent(event) && event.type === DayEventType.Meal;
}

export const isPillEvent = (event: DayEvent): event is PillEvent => {
  return isDayEvent(event) && event.type === DayEventType.Pill;
}