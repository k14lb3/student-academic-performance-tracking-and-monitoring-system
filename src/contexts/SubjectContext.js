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

    let students = subjectStudentsSnapshot.docs.map(async (student) => {
      const userSnapshot = await REF.USER({ user_uid: student.id }).get();
      const { firstName, lastName, middleName } = userSnapshot.data();
      const name = `${lastName}, ${firstName} ${middleName}`;
      return {
        id: student.id,
        name: name,
        ...student.data(),
      };
    });

    const subjectSnapshot = await REF.SUBJECT({ subject_code: code }).get();

    students = (await Promise.all(students)).sort((sa, sb) => {
      const studentA = sa.name.toLowerCase();
      const studentB = sb.name.toLowerCase();
      return studentA < studentB ? -1 : studentA > studentB ? 1 : 0;
    });

    students = students.reduce((students, student) => {
      const { id, ...rest } = student;
      return {
        ...students,
        [student.id]: rest,
      };
    }, {});

    setSubject({
      code: code,
      ...subjectSnapshot.data(),
      students: students,
    });

    return Object.keys(students)[0];
  };

  const updateSubjectSettings = async (settings) => {
    updateTitle(subject.code, settings.title);
    REF.SUBJECT({ subject_code: subject.code }).update(settings);
  };

  const updateStudent = async (studentId) => {
    const { name, ...rest } = subject.students[studentId];

    await REF.SUBJECT_STUDENT({
      subject_code: subject.code,
      student_uid: studentId,
    }).update({
      ...rest,
    });
  };

  const computeGrade = (id) => {
    const student = subject.students[id];

    const attendancePercentagePer = subject.percentages.attendance / 100;

    const attendanceComputation =
      (((student.lectures / subject.lectures) * 62.5 + 37.5) / 100) *
      attendancePercentagePer;

    const majorExaminationPercentagePer =
      subject.percentages.majorExaminations / 100 / 4;

    const prelimExaminationComputation =
      (((student.majorExaminations.prelim.score /
        subject.majorExaminations.prelim.totalScore) *
        62.5 +
        37.5) /
        100) *
      majorExaminationPercentagePer;

    const midtermExaminationComputation =
      (((student.majorExaminations.midterm.score /
        subject.majorExaminations.midterm.totalScore) *
        62.5 +
        37.5) /
        100) *
      majorExaminationPercentagePer;

    const semiFinalsExaminationComputation =
      (((student.majorExaminations.semiFinals.score /
        subject.majorExaminations.semiFinals.totalScore) *
        62.5 +
        37.5) /
        100) *
      majorExaminationPercentagePer;

    const finalsExaminationComputation =
      (((student.majorExaminations.finals.score /
        subject.majorExaminations.finals.totalScore) *
        62.5 +
        37.5) /
        100) *
      majorExaminationPercentagePer;

    const activitiesPercentagePer =
      subject.percentages.activities /
      100 /
      (subject.exercises.length +
        subject.assignments.length +
        subject.quizzes.length);

    let activitiesComputation = 0;

    if (
      subject.exercises.length === 0 &&
      (subject.assignments.length === 0) & (subject.quizzes.length === 0)
    ) {
      activitiesComputation = subject.percentages.activities / 100;
    } else {
      subject.students[id].exercises.forEach((exercise, index) => {
        activitiesComputation +=
          (((exercise.score / subject.exercises[index].totalScore) * 62.5 +
            37.5) /
            100) *
          activitiesPercentagePer;
      });

      subject.students[id].assignments.forEach((assignment, index) => {
        activitiesComputation +=
          (((assignment.score / subject.assignments[index].totalScore) * 62.5 +
            37.5) /
            100) *
          activitiesPercentagePer;
      });

      subject.students[id].quizzes.forEach((quiz, index) => {
        activitiesComputation +=
          (((quiz.score / subject.quizzes[index].totalScore) * 62.5 + 37.5) /
            100) *
          activitiesPercentagePer;
      });
    }

    const convertToPercentage = (number) => {
      return number * 100;
    };

    const computedGrade =
      convertToPercentage(attendanceComputation) +
      convertToPercentage(activitiesComputation) +
      convertToPercentage(prelimExaminationComputation) +
      convertToPercentage(midtermExaminationComputation) +
      convertToPercentage(semiFinalsExaminationComputation) +
      convertToPercentage(finalsExaminationComputation);

    return parseFloat(computedGrade.toFixed(2));
  };

  const publishGrade = async (id, grade) => {
    await REF.SUBJECT_STUDENT({
      subject_code: subject.code,
      student_uid: id,
    }).update({
      grade: grade,
    });
  };

  const changeAttendance = async (id, studentLectures, subjectLectures, x) => {
    if (
      (studentLectures > 0 && x === -1) ||
      (studentLectures < subjectLectures && x === 1)
    ) {
      setSubject((prevSubject) => ({
        ...prevSubject,
        students: {
          ...prevSubject.students,
          [id]: {
            ...prevSubject.students[id],
            lectures: prevSubject.students[id].lectures + x,
          },
        },
      }));
    }
  };

  const changeMajorExaminationScore = async (id, exam, score, totalScore) => {
    setSubject((prevSubject) => ({
      ...prevSubject,
      students: {
        ...prevSubject.students,
        [id]: {
          ...prevSubject.students[id],
          majorExaminations: {
            ...prevSubject.students[id].majorExaminations,
            [exam]: { score: score > totalScore ? totalScore : score },
          },
        },
      },
    }));
  };

  const changeMajorExaminationTotalScore = async (exam, totalScore) => {
    let highestScore = 0;

    Object.values(subject.students).forEach((student, index) => {
      if (index === 0) {
        highestScore = student.majorExaminations[exam].score;
      }
      if (student.majorExaminations[exam].score > highestScore) {
        highestScore = student.majorExaminations[exam].score;
      }
    });

    if (totalScore < highestScore) {
      totalScore = highestScore;
    }

    const majorExaminations = {
      ...subject.majorExaminations,
      [exam]: {
        totalScore: totalScore,
      },
    };

    setSubject((prevSubject) => ({
      ...prevSubject,
      majorExaminations: majorExaminations,
    }));

    await REF.SUBJECT({ subject_code: subject.code }).update({
      majorExaminations: majorExaminations,
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
      students: Object.entries(prevSubject.students).reduce(
        (students, student) => ({
          ...students,
          [student[0]]: {
            ...student[1],
            [activity]: [...student[1][activity], { score: 0 }],
          },
        }),
        {}
      ),
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      [activity]: activities,
    });

    Object.entries(subject.students).forEach(async (student) => {
      await REF.SUBJECT_STUDENT({
        subject_code: subject.code,
        student_uid: student[0],
      }).update({
        [activity]: [...student[1][activity], { score: 0 }],
      });
    });
  };

  const deleteActivity = (activity, i) => {
    const activities = subject[activity].filter((_, index) => index !== i);

    setSubject((prevSubject) => ({
      ...prevSubject,
      [activity]: activities,
      students: Object.entries(prevSubject.students).reduce(
        (students, student) => ({
          ...students,
          [student[0]]: {
            ...student[1],
            [activity]: student[1][activity].filter((_, index) => index !== i),
          },
        }),
        {}
      ),
    }));

    REF.SUBJECT({ subject_code: subject.code }).update({
      [activity]: activities,
    });

    Object.entries(subject.students).forEach(async (student) => {
      await REF.SUBJECT_STUDENT({
        subject_code: subject.code,
        student_uid: student[0],
      }).update({
        [activity]: student[1][activity].filter((_, index) => index !== i),
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

    const activities = subject.students[id][activity].map((activity, index) => {
      if (index === i) {
        return {
          score: score,
        };
      }
      return activity;
    });

    setSubject(() => ({
      ...subject,
      students: {
        ...subject.students,
        [id]: {
          ...subject.students[id],
          [activity]: activities,
        },
      },
    }));
  };

  const changeActivityTotalScore = async (activity, i, totalScore) => {
    let highestScore = 0;

    Object.values(subject.students).forEach((student, index) => {
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
    computeGrade,
    publishGrade,
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
