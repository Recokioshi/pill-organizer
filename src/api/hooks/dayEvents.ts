import { User } from "firebase/auth"
import { collection, deleteDoc, doc, onSnapshot, setDoc, query, getDoc } from "firebase/firestore"
import { firestore } from "../../config/firebase"
import { TDayEvent } from "../types/dayEvent";


export const DayEvent = (user: User) => {
  const dayEventsRef = collection(firestore, "dayEvents", user.uid, "events");

  return {
    listenDayEvents: (callback: (snapshot: TDayEvent[]) => void) => {
      const q = query(dayEventsRef);
      const unsubscribe = onSnapshot(q, snapshot => {
        const events = [] as TDayEvent[];
        snapshot.forEach((doc) => {
          events.push(doc.data() as TDayEvent);
        });
        callback(events);
      });
      return unsubscribe;
    },
    getDayEvent: async (id: string) => {
      return await getDoc(doc(dayEventsRef, id));
    },
    setDayEvent: async (dayEvent: TDayEvent) => {
      await setDoc(doc(dayEventsRef), dayEvent);
    },
    deleteDayEvent: async (dayEventId: string) => {
      await deleteDoc(doc(dayEventsRef));
    },
  };
}