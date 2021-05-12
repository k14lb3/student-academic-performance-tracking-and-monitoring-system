import { db } from 'firebase.js';

export const REF = {
  USERS: () => db.collection('users'),
  USER: ({ user_uid }) => db.collection('users').doc(user_uid),
  USER_SUBJECTS: ({ user_uid }) =>
    db.collection('users').doc(user_uid).collection('subjects'),
  USER_SUBJECT: ({ user_uid, subject_code }) =>
    db
      .collection('users')
      .doc(user_uid)
      .collection('subjects')
      .doc(subject_code),
  USER_ARCHIVED_SUBJECTS: ({ user_uid }) =>
    db.collection('users').doc(user_uid).collection('archived_subjects'),
  USER_ARCHIVED_SUBJECT: ({ user_uid, subject_code }) =>
    db
      .collection('users')
      .doc(user_uid)
      .collection('archived_subjects')
      .doc(subject_code),
  USER_ARCHIVED_SUBJECT_STUDENTS: ({ user_uid, subject_code }) =>
    db
      .collection('users')
      .doc(user_uid)
      .collection('archived_subjects')
      .doc(subject_code)
      .collection('students'),
  USER_ARCHIVED_SUBJECT_STUDENT: ({ user_uid, subject_code, student_uid }) =>
    db
      .collection('users')
      .doc(user_uid)
      .collection('archived_subjects')
      .doc(subject_code)
      .collection('students')
      .doc(student_uid),
  SUBJECTS: () => db.collection('subjects'),
  SUBJECT: ({ subject_code }) => db.collection('subjects').doc(subject_code),
  SUBJECT_STUDENTS: ({ subject_code }) =>
    db.collection('subjects').doc(subject_code).collection('students'),
  SUBJECT_STUDENT: ({ subject_code, student_uid }) =>
    db
      .collection('subjects')
      .doc(subject_code)
      .collection('students')
      .doc(student_uid),
};
