import { User } from "firebase/auth"
import { collection, deleteDoc, doc, onSnapshot, setDoc, query, getDoc } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, StorageError, StorageReference, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { firestore, storage } from "../../config/firebase"
import { TDayEvent } from "../types/dayEvent";

type UploadFile = (
  imgRef: StorageReference,
  file: Blob,
  setProgress: (progress: number) => void,
  setError: (error: StorageError) => void,
  setUploading: (uploading: boolean) => void,
  onFinishCallback: (url: string) => void,
) => void;
const uploadFile: UploadFile = (imgRef, file, setProgress, setError, setUploading, onFinishCallback) => {
  const metadata = {
    contentType: 'image/jpeg'
  };
  const uploadTask = uploadBytesResumable(imgRef, file, metadata);
  setUploading(true);
  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);
    }, 
    (error) => {
      setError(error);
      setUploading(false);
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(url => {
        setUploading(false);
        onFinishCallback(url);
      })
    }
  );
};

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
    useSetDayEvent: () => {
      const [progress, setProgress] = useState<number>(0);
      const [error, setError] = useState<StorageError | null>(null);
      const [uploading, setUploading] = useState<boolean>(false);

      const upload = (dayEvent: TDayEvent, file: Blob | null) => {
        const id = uuidv4();
        const eventToSave = {
          ...dayEvent,
          id,
        }
        if (file) {
          const imgRef = ref(spaceRef, `${id}.jpg`);
          uploadFile(imgRef, file, setProgress, setError, setUploading, (imageUrl) => {
            setDoc(doc(dayEventsRef, id), {...eventToSave, imageUrl}).catch(setError);
          });
        } else {
          setDoc(doc(dayEventsRef, id), eventToSave).catch(setError);
        }
      }

      return {
        upload,
        progress,
        error,
        uploading,
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