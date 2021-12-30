import { User } from "firebase/auth"
import { collection, deleteDoc, doc, onSnapshot, setDoc, query, getDoc } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid";
import { firestore } from "../../config/firebase"
import { TEventGroup } from "../types/eventGroup";

export const EventGroup = (user: User) => {
  const eventGroupsRef = collection(firestore, "eventGroups", user.uid, "groups");

  return {
    listenEventGroups: (callback: (snapshot: TEventGroup[]) => void) => {
      const q = query(eventGroupsRef);
      const unsubscribe = onSnapshot(q, snapshot => {
        const groups = [] as TEventGroup[];
        snapshot.forEach((doc) => {
          groups.push(doc.data() as TEventGroup);
        });
        callback(groups);
      });
      return unsubscribe;
    },
    getEventGroup: async (id: string) => {
      return await getDoc(doc(eventGroupsRef, id));
    },
    setEventGroup: async (eventGroup: TEventGroup) => {
      const id = uuidv4();
      const groupToSave = {
        ...eventGroup,
        id,
      }
      
      try{
        await setDoc(doc(eventGroupsRef, id), groupToSave);
      } catch (error) {
        console.error(error);
      }
    },
    deleteEventGroup: async (eventGroupId: string) => {
      try{
        await deleteDoc(doc(eventGroupsRef, eventGroupId));
      } catch (e) {
        console.error(e);
      }
    },
  };
}