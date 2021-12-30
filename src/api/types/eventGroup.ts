import { DocumentReference } from "firebase/firestore";

export type TEventGroup = {
  id?: string;
  name: string;
  description?: string;
  childrenDocs?: DocumentReference[];
  effectiveTime?: string;
}