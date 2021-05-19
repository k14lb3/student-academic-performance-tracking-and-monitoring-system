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

  const addActivity = async (activity) => {
    let title = '';

    if (activity === 'exercises') {
      title = 'Exercise';
    } else if (activity === 'assignments') {
      title = 'Assignment';
    } else if (activity === 'quizzes') {
      title = 'Quiz';
    }

    const activities = [
      ...subject[activity],
      {
        title: title,
        totalScore: 20,
      },
    ];

    setSubject((prevSubject) => ({
      ...prevSubject,
      [activity]: activities,
      students: prevSubject.students.map((student) => {
        return {
          ...student,
          [activity]: [...student[activity], { score: 0 }],
        };
      }),
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      [activity]: activities,
    });

    subject.students.forEach(async (student) => {
      await REF.SUBJECT_STUDENT({
        subject_code: subject.code,
        student_uid: student.id,
      }).update({
        [activity]: [...student[activity], { score: 0 }],
      });
    });
  };

  const deleteActivity = (activity, i) => {
    const activities = subject[activity].filter((_, index) => index !== i);

    setSubject((prevSubject) => ({
      ...prevSubject,
      [activity]: activities,
      students: prevSubject.students.map((student) => ({
        ...student,
        [activity]: student[activity].filter((_, index) => index !== i),
      })),
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      [activity]: activities,
    });

    subject.students.forEach(async (student) => {
      await REF.SUBJECT_STUDENT({
        subject_code: subject.code,
        student_uid: student.id,
      }).update({
        [activity]: student[activity].filter((_, index) => index !== i),
      });
    });
  };

  const changeActivityTitle = async (activity, i, title) => {
    const activities = subject[activity].map((activity, index) => {
      if (index === i) {
        return {
          ...activity,
          title: title,
        };
      }
      return activity;
    });

    setSubject((prevSubject) => ({
      ...prevSubject,
      [activity]: activities,
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      [activity]: activities,
    });
  };

  const changeActivityScore = async (activity, id, i, score, totalScore) => {
    if (score > totalScore) {
      score = totalScore;
    }

    setSubject();

    const student = subject.students.find((student) => student.id === id);

    const activities = student[activity].map((activity, index) => {
      if (index === i) {
        return {
          score: score,
        };
      }
      return activity;
    });

    setSubject(() => ({
      ...subject,
      students: subject.students.map((student) => {
        if (student.id === id) {
          return {
            ...student,
            [activity]: activities,
          };
        }
        return student;
      }),
    }));
  };

  const changeActivityTotalScore = async (activity, i, totalScore) => {
    let highestScore = 0;

    subject.students.forEach((student, index) => {
      if (index === 0) {
        highestScore = student[activity][i].score;
      }
      if (student[activity][i].score > highestScore) {
        highestScore = student[activity][i].score;
      }
    });

    if (totalScore < highestScore) {
      totalScore = highestScore;
    }

    const activities = subject[activity].map((exercise, index) => {
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
      [activity]: activities,
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      [activity]: activities,
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
    addActivity,
    deleteActivity,
    changeActivityTitle,
    changeActivityScore,
    changeActivityTotalScore,
  };

  return (
    <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>
  );
};

export default SubjectProvider;
