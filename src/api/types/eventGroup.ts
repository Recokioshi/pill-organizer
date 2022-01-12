import { DocumentReference } from "firebase/firestore";

export type TEventGroup = {
  id?: string;
  name: string;
  description?: string;
  childrenEvents?: DocumentReference[];
  childrenGroups?: DocumentReference[];
  finishedEvents?: string[],
  effectiveTime?: string;
  master: boolean;
}