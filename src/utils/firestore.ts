import { db } from '@/firebase/init'
import {
  doc, collection, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy,
  type Unsubscribe,
} from 'firebase/firestore'
import type { Course, TimeSlot } from '@/types'

function userPrefix(uid: string) {
  return `users/${uid}`
}

export function coursesRef(uid: string) {
  return collection(db, userPrefix(uid), 'courses')
}

export function courseRef(uid: string, courseId: string) {
  return doc(db, userPrefix(uid), 'courses', courseId)
}

export function subscribeCourses(uid: string, callback: (courses: Course[]) => void): Unsubscribe {
  const q = query(coursesRef(uid), orderBy('name'))
  return onSnapshot(q, (snapshot) => {
    const list: Course[] = []
    snapshot.forEach((d) => {
      const data = d.data() as Omit<Course, 'id'>
      list.push({ id: d.id, ...data })
    })
    callback(list)
  })
}

export async function addCourse(uid: string, course: Omit<Course, 'id'>) {
  return addDoc(coursesRef(uid), course)
}

export async function updateCourse(uid: string, courseId: string, data: Partial<Course>) {
  return updateDoc(courseRef(uid, courseId), data)
}

export async function deleteCourse(uid: string, courseId: string) {
  return deleteDoc(courseRef(uid, courseId))
}

export function timeSlotsRef(uid: string) {
  return collection(db, userPrefix(uid), 'timeSlots')
}

export function subscribeTimeSlots(uid: string, callback: (slots: TimeSlot[]) => void): Unsubscribe {
  const q = query(timeSlotsRef(uid), orderBy('slot'))
  return onSnapshot(q, (snapshot) => {
    const list: TimeSlot[] = []
    snapshot.forEach((d) => {
      const data = d.data() as Omit<TimeSlot, 'id'>
      list.push({ id: d.id, ...data })
    })
    callback(list)
  })
}

export async function batchUpdateTimeSlots(uid: string, slots: Omit<TimeSlot, 'id'>[]) {
  const ref = timeSlotsRef(uid)
  for (const s of slots) {
    await addDoc(ref, s)
  }
}

export function semesterRef(uid: string) {
  return doc(db, userPrefix(uid), 'semester', 'current')
}

export function userSettingsRef(uid: string) {
  return doc(db, userPrefix(uid), 'settings', 'preferences')
}
