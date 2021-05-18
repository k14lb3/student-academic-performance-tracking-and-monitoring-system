import { createContext, useContext, useState } from 'react';
import { useSubjects } from 'contexts/SubjectsContext';
import { REF } from 'refs';

const SubjectContext = createContext();

export const useSubject = () => useContext(SubjectContext);

const SubjectProvider = ({ children }) => {
  const { updateTitle } = useSubjects();
  const [subject, setSubject] = useState();

  const getSubject = async (code) => {
    const subjectStudentsSnapshot = await REF.SUBJECT_STUDENTS({
      subject_code: code,
    }).get();

    const subjectStudents = subjectStudentsSnapshot.docs.map(
      async (student) => {
        const userSnapshot = await REF.USER({ user_uid: student.id }).get();
        const { firstName, lastName, middleName } = userSnapshot.data();
        const name = `${lastName}, ${firstName} ${middleName}`;
        return {
          id: student.id,
          name: name,
          ...student.data(),
        };
      }
    );

    const subjectSnapshot = await REF.SUBJECT({ subject_code: code }).get();

    const students = (await Promise.all(subjectStudents)).sort((sa, sb) => {
      const studentA = sa.name.toLowerCase();
      const studentB = sb.name.toLowerCase();
      return studentA < studentB ? -1 : studentA > studentB ? 1 : 0;
    });

    setSubject({
      code: code,
      ...subjectSnapshot.data(),
      students: students,
    });

    return students[0];
  };

  const updateSubjectSettings = async (settings) => {
    updateTitle(subject.code, settings.title);
    subject.students.forEach((student) => {
      if (settings.lectures < student.lectures) {
        settings.lectures = student.lectures;
      }
    });
    REF.SUBJECT({ subject_code: subject.code }).update(settings);
  };

  const updateStudent = async (studentId) => {
    const student = subject.students.find(
      (student) => student.id === studentId
    );

    const { id, name, ...rest } = student;

    await REF.SUBJECT_STUDENT({
      subject_code: subject.code,
      student_uid: id,
    }).update(rest);
  };

  const changeAttendance = async (id, studentLectures, subjectLectures, x) => {
    if (
      (studentLectures > 0 && x === -1) ||
      (studentLectures < subjectLectures && x === 1)
    ) {
      setSubject((prevSubject) => ({
        ...prevSubject,
        students: prevSubject.students.map((student) => {
          if (student.id === id) {
            return {
              ...student,
              lectures: student.lectures + x,
            };
          }
          return student;
        }),
      }));
    }
  };

  const changeMajorExaminationScore = async (id, exam, score, totalScore) => {
    setSubject((prevSubject) => ({
      ...prevSubject,
      students: prevSubject.students.map((student) => {
        if (student.id === id) {
          return {
            ...student,
            majorExamination: {
              ...student.majorExamination,
              [exam]: { score: score > totalScore ? totalScore : score },
            },
          };
        }
        return student;
      }),
    }));
  };

  const changeMajorExaminationTotalScore = async (exam, totalScore) => {
    let highestScore = 0;

    subject.students.forEach((student, index) => {
      if (index === 0) {
        highestScore = student.majorExamination[exam].score;
      }
      if (student.majorExamination[exam].score > highestScore) {
        highestScore = student.majorExamination[exam].score;
      }
    });

    if (totalScore < highestScore) {
      totalScore = highestScore;
    }

    const majorExamination = {
      ...subject.majorExamination,
      [exam]: {
        totalScore: totalScore,
      },
    };

    setSubject((prevSubject) => ({
      ...prevSubject,
      majorExamination: majorExamination,
    }));

    await REF.SUBJECT({ subject_code: subject.code }).update({
      majorExamination: majorExamination,
    });
  };

  const addExercise = async () => {
    const subjectExercises = [
      ...subject.exercises,
      { title: 'Exercise', totalScore: 20 },
    ];

    setSubject((prevSubject) => ({
      ...prevSubject,
      exercises: subjectExercises,
      students: prevSubject.students.map((student) => ({
        ...student,
        exercises: [...student.exercises, { score: 0 }],
      })),
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      exercises: subjectExercises,
    });

    subject.students.forEach(async (student) => {
      await REF.SUBJECT_STUDENT({
        subject_code: subject.code,
        student_uid: student.id,
      }).update({
        exercises: [...student.exercises, { score: 0 }],
      });
    });
  };

  const deleteExercise = (i) => {
    const subjectExercises = subject.exercises.filter(
      (_, index) => index !== i
    );

    setSubject((prevSubject) => ({
      ...prevSubject,
      exercises: subjectExercises,
      students: prevSubject.students.map((student) => ({
        ...student,
        exercises: student.exercises.filter((_, index) => index !== i),
      })),
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      exercises: subjectExercises,
    });

    subject.students.forEach(async (student) => {
      await REF.SUBJECT_STUDENT({
        subject_code: subject.code,
        student_uid: student.id,
      }).update({
        exercises: student.exercises.filter((_, index) => index !== i),
      });
    });
  };

  const changeExerciseTitle = async (i, title) => {
    const exercises = subject.exercises.map((exercise, index) => {
      if (index === i) {
        return {
          ...exercise,
          title: title,
        };
      }
      return exercise;
    });

    setSubject((prevSubject) => ({
      ...prevSubject,
      exercises: exercises,
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      exercises: exercises,
    });
  };

  const changeExerciseScore = async (id, i, score, totalScore) => {
    if (score > totalScore) {
      score = totalScore;
    }

    setSubject();

    const student = subject.students.find((student) => student.id === id);

    const exercises = student.exercises.map((exercise, index) => {
      if (index === i) {
        return {
          score: score,
        };
      }
      return exercise;
    });

    setSubject(() => ({
      ...subject,
      students: subject.students.map((student) => {
        if (student.id === id) {
          return {
            ...student,
            exercises: exercises,
          };
        }
        return student;
      }),
    }));
  };

  const changeExerciseTotalScore = async (i, totalScore) => {
    let highestScore = 0;

    subject.students.forEach((student, index) => {
      if (index === 0) {
        highestScore = student.exercises[i].score;
      }
      if (student.exercises[i].score > highestScore) {
        highestScore = student.exercises[i].score;
      }
    });

    if (totalScore < highestScore) {
      totalScore = highestScore;
    }

    const exercises = subject.exercises.map((exercise, index) => {
      if (index === i) {
        return {
          ...exercise,
          totalScore: totalScore,
        };
      }
      return exercise;
    });

    setSubject((prevSubject) => ({
      ...prevSubject,
      exercises: exercises,
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      exercises: exercises,
    });
  };

  const addAssignment = async () => {
    const assignments = [
      ...subject.assignments,
      { title: 'Assignment', totalScore: 20 },
    ];

    setSubject((prevSubject) => ({
      ...prevSubject,
      assignments: assignments,
      students: prevSubject.students.map((student) => {
        return {
          ...student,
          assignments: [...student.assignments, { score: 0 }],
        };
      }),
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      assignments: assignments,
    });

    subject.students.forEach(async (student) => {
      await REF.SUBJECT_STUDENT({
        subject_code: subject.code,
        student_uid: student.id,
      }).update({
        assignments: [...student.assignments, { score: 0 }],
      });
    });
  };

  const deleteAssignment = (i) => {
    const assignments = subject.assignments.filter((_, index) => index !== i);

    setSubject((prevSubject) => ({
      ...prevSubject,
      assignments: assignments,
      students: prevSubject.students.map((student) => ({
        ...student,
        assignments: student.assignments.filter((_, index) => index !== i),
      })),
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      assignments: assignments,
    });

    subject.students.forEach(async (student) => {
      await REF.SUBJECT_STUDENT({
        subject_code: subject.code,
        student_uid: student.id,
      }).update({
        assignments: student.assignments.filter((_, index) => index !== i),
      });
    });
  };

  const changeAssignmentTitle = async (i, title) => {
    const assignments = subject.assignments.map((exercise, index) => {
      if (index === i) {
        return {
          ...exercise,
          title: title,
        };
      }
      return exercise;
    });

    setSubject((prevSubject) => ({
      ...prevSubject,
      assignments: assignments,
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      assignments: assignments,
    });
  };

  const changeAssignmentScore = async (id, i, score, totalScore) => {
    if (score > totalScore) {
      score = totalScore;
    }

    setSubject();

    const student = subject.students.find((student) => student.id === id);

    const assignments = student.assignments.map((exercise, index) => {
      if (index === i) {
        return {
          score: score,
        };
      }
      return exercise;
    });

    setSubject(() => ({
      ...subject,
      students: subject.students.map((student) => {
        if (student.id === id) {
          return {
            ...student,
            assignments: assignments,
          };
        }
        return student;
      }),
    }));
  };

  const changeAssignmentTotalScore = async (i, totalScore) => {
    let highestScore = 0;

    subject.students.forEach((student, index) => {
      if (index === 0) {
        highestScore = student.assignments[i].score;
      }
      if (student.assignments[i].score > highestScore) {
        highestScore = student.assignments[i].score;
      }
    });

    if (totalScore < highestScore) {
      totalScore = highestScore;
    }

    const assignments = subject.assignments.map((exercise, index) => {
      if (index === i) {
        return {
          ...exercise,
          totalScore: totalScore,
        };
      }
      return exercise;
    });

    setSubject((prevSubject) => ({
      ...prevSubject,
      assignments: assignments,
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      assignments: assignments,
    });
  };
  const value = {
    subject,
    getSubject,
    updateSubjectSettings,
    updateStudent,
    changeAttendance,
    changeMajorExaminationScore,
    changeMajorExaminationTotalScore,
    addExercise,
    deleteExercise,
    changeExerciseTitle,
    changeExerciseScore,
    changeExerciseTotalScore,
    addAssignment,
    deleteAssignment,
    changeAssignmentTitle,
    changeAssignmentScore,
    changeAssignmentTotalScore,
  };

  return (
    <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>
  );
};

export default SubjectProvider;
