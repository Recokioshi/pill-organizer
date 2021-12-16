export type TDayEvent = {
  title: string;
  description: string;
  imageUrl: string;
  customFields?: {
    [key: string]: string;
  }
}