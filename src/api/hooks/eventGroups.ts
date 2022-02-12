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

  const get = async (id: string) => {
    return await getDoc(doc(eventGroupsRef, id));
  };

  const set = async (eventGroup: TEventGroup) => {
    const id = uuidv4();
    const groupToSave: TEventGroup = {
      ...eventGroup,
      childrenEvents: eventGroup.childrenEvents || [],
      childrenGroups: eventGroup.childrenGroups || [],
      finishedEvents: eventGroup.finishedEvents || [],
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

  const update = async (id: string, objectToUpdate: Partial<TEventGroup>) => {
    try {
      await updateDoc(doc(eventGroupsRef, id), objectToUpdate);
    } catch (error) {
      console.error(error);
    }
  };

  const remove = async (eventGroupId: string) => {
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
      const newGroupId = await set({
        name: subgroupName,
        master: false,
        description: "",
        childrenEvents: [],
        childrenGroups: [],
        finishedEvents: [],
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
      await remove(childGroupId);
    } catch (e) {
      console.error(e);
    }
  };

  const moveUp = async (eventGroupId: string, childGroupId: string) => {
    try{
      const eventGroupResponse = await get(eventGroupId);
      const eventGroupData = eventGroupResponse.data() as TEventGroup;
      const childrenGroups = eventGroupData.childrenGroups || [];
      const index = childrenGroups.findIndex(group => group.id === childGroupId);
      if(index > 0){
        const newChildrenGroups = childrenGroups.slice();
        const childGroup = newChildrenGroups.splice(index, 1)[0];
        newChildrenGroups.splice(index - 1, 0, childGroup);
        await updateDoc(doc(eventGroupsRef, eventGroupId), {
          childrenGroups: newChildrenGroups,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const moveDown = async (eventGroupId: string, childGroupId: string) => {
    try{
      const eventGroupResponse = await get(eventGroupId);
      const eventGroupData = eventGroupResponse.data() as TEventGroup;
      const childrenGroups = eventGroupData.childrenGroups || [];
      const index = childrenGroups.findIndex(group => group.id === childGroupId);
      if(index < childrenGroups.length - 1){
        const newChildrenGroups = childrenGroups.slice();
        const childGroup = newChildrenGroups.splice(index, 1)[0];
        newChildrenGroups.splice(index + 1, 0, childGroup);
        await updateDoc(doc(eventGroupsRef, eventGroupId), {
          childrenGroups: newChildrenGroups,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addFinishedEvent = async (eventGroupId: string, finishedEventId: string) => {
    try {
      await updateDoc(doc(eventGroupsRef, eventGroupId), {
        finishedEvents: arrayUnion(finishedEventId),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const removeFinishedEvent = async (eventGroupId: string, removedEventId: string) => {
    try {
      await updateDoc(doc(eventGroupsRef, eventGroupId), {
        finishedEvents: arrayRemove(removedEventId),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const resetFinishedEvents = async (eventGroupId: string) => {
    try {
      await updateDoc(doc(eventGroupsRef, eventGroupId), {
        finishedEvents: [],
      });
    } catch (e) {
      console.error(e);
    }
  };
  
  return {
    listenEventGroups,
    get,
    set,
    remove,
    update,
    addEventToGroup,
    removeEventFromGroup,
    addGroupToGroup,
    removeGroupFromGroup,
    moveUp,
    moveDown,
    addFinishedEvent,
    removeFinishedEvent,
    resetFinishedEvents,
  };
}