import { User } from "firebase/auth"
import { collection, deleteDoc, doc, onSnapshot, setDoc, query, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid";
import { firestore } from "../../config/firebase"
import { TEventGroup } from "../types/eventGroup";
import { getEventsRef } from "./dayEvents";

export const EventGroup = (user: User) => {
  const eventGroupsRef = collection(firestore, "eventGroups", user.uid, "groups");

  const listenEventGroups = (callback: (snapshot: TEventGroup[]) => void) => {
    const q = query(eventGroupsRef);
    const unsubscribe = onSnapshot(q, snapshot => {
      const groups = [] as TEventGroup[];
      snapshot.forEach((doc) => {
        groups.push(doc.data() as TEventGroup);
      });
      callback(groups);
    });
    return unsubscribe;
  };

  const getEventGroup = async (id: string) => {
    return await getDoc(doc(eventGroupsRef, id));
  };

  const setEventGroup = async (eventGroup: TEventGroup) => {
    const id = uuidv4();
    const groupToSave = {
      ...eventGroup,
      id,
    }
    
    try{
      await setDoc(doc(eventGroupsRef, id), groupToSave);
      return id;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const deleteEventGroup = async (eventGroupId: string) => {
    try{
      await deleteDoc(doc(eventGroupsRef, eventGroupId));
    } catch (e) {
      console.error(e);
    }
  };

  const addEventToGroup = async (eventGroupId: string, eventId: string) => {
    try{
      await updateDoc(doc(eventGroupsRef, eventGroupId), {
        childrenEvents: arrayUnion(doc(getEventsRef(user), eventId)),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const removeEventFromGroup = async (eventGroupId: string, eventId: string) => {
    try{
      await updateDoc(doc(eventGroupsRef, eventGroupId), {
        childrenEvents: arrayRemove(doc(getEventsRef(user), eventId)),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const addGroupToGroup = async (eventGroupId: string, subgroupName: string) => {
    try{
      const newGroupId = await setEventGroup({
        name: subgroupName,
        master: false,
        description: "",
        childrenEvents: [],
        childrenGroups: [],
        effectiveTime: "",
      });
      if(newGroupId){
        await updateDoc(doc(eventGroupsRef, eventGroupId), {
          childrenGroups: arrayUnion(doc(eventGroupsRef, newGroupId)),
        });
      }
      
    } catch (e) {
      console.error(e);
    }
  };

  const removeGroupFromGroup = async (eventGroupId: string, childGroupId: string) => {
    try{
      await updateDoc(doc(eventGroupsRef, eventGroupId), {
        childrenGroups: arrayRemove(doc(eventGroupsRef, childGroupId)),
      });
      await deleteEventGroup(childGroupId);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    listenEventGroups,
    getEventGroup,
    setEventGroup,
    deleteEventGroup,
    addEventToGroup,
    removeEventFromGroup,
    addGroupToGroup,
    removeGroupFromGroup,
  };
}