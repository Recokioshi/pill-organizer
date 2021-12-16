export type TDayEvent = {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  customFields?: {
    [key: string]: string;
  }
}