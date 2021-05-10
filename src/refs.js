import { db } from 'firebase.js';

export const REF = {
  USERS: () => db.collection('users'),
  USER: ({ user_uid }) => db.collection('users').doc(user_uid),
  USER_SUBJECTS: ({ user_uid }) =>
    db.collection('users').doc(user_uid).collection('subjecs'),
  USER_ARCHIVED_SUBJECTS: ({ user_uid }) =>
    db.collection('users').doc(user_uid).collection('archived_subjecs'),
  SUBJECTS: () => db.collection('subjects'),
  SUBJECT: ({ subject_code }) => db.collection('subjects').doc(subject_code),
  SUBJECT_STUDENTS: ({ subject_code }) =>
    db.collection('subjects').doc(subject_code).collection('students'),
};
