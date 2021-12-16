import { User } from "firebase/auth"
import { collection, deleteDoc, doc, onSnapshot, setDoc, query, getDoc } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { firestore, storage } from "../../config/firebase"
import { TDayEvent } from "../types/dayEvent";


export const DayEvent = (user: User) => {
  const dayEventsRef = collection(firestore, "dayEvents", user.uid, "events");
  const spaceRef = ref(storage, 'eventImages');

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
    setDayEvent: async (dayEvent: TDayEvent, file: Blob | null) => {
      const id = uuidv4();
      const eventToSave = {
        ...dayEvent,
        id,
      }
      if (file) {
        const imgRef = ref(spaceRef, `${id}.jpg`);
        uploadBytes(imgRef, file).then(async (snapshot) => {
          const imageUrl = await getDownloadURL(imgRef);
          await setDoc(doc(dayEventsRef, id), {...eventToSave, imageUrl});
        });
      } else {
        await setDoc(doc(dayEventsRef, id), eventToSave);
      }
    },
    deleteDayEvent: async (dayEventId: string) => {
      try{
        await deleteDoc(doc(dayEventsRef, dayEventId));
        const imgRef = ref(spaceRef, `${dayEventId}.jpg`);
        const imageUrl = await getDownloadURL(imgRef);
        if(imageUrl){
          await deleteObject(imgRef);
        }
      } catch (e) {
        console.error(e);
      }
    },
  };
}