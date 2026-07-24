/**
 
 * Core Data & Storage Handler with Pure 0-Baseline Initial State
 */

// All Available Courses in Curriculum with Credit Capacities:
// 4-Credit Courses = 60 Semester Classes
// 3-Credit Courses = 45 Semester Classes
// 1-Credit Labs = 15 Semester Classes
const ALL_COURSES = {
  // Regular Theory Courses
  "CSD3151": { code: "CSD 3151", name: "Data and Network Security", type: "Regular", credits: 3, semesterTotal: 45, faculty: "Mrs. G. Safiya Begam" },
  "CSD3152": { code: "CSD 3152", name: "Cloud Computing Services", type: "Regular", credits: 4, semesterTotal: 60, faculty: "Dr. G. Aarthi" },
  "CSD3153": { code: "CSD 3153", name: "Automata Theory", type: "Regular", credits: 3, semesterTotal: 45, faculty: "Mrs. A. Sulthana Rashya Begam" },
  "CSD3154": { code: "CSD 3154", name: "Machine Learning Techniques", type: "Regular", credits: 3, semesterTotal: 45, faculty: "Mrs. M.S. Usha" },

  // Elective Courses (CSDX)
  "CSDX501": { code: "CSDX 501", name: "Web and Social Media Mining", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Faculty 8" },
  "CSDX502": { code: "CSDX 502", name: "Artificial Neural Networks", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Dr. S. Revathi" },
  "CSDX503": { code: "CSDX 503", name: "Artificial Intelligence based Web Application", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Mrs. A. Nazreen" },
  "CSDX507": { code: "CSDX 507", name: "Decision Making for Data Science", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Mrs. K. Sowmiya" },
  "CSDX509": { code: "CSDX 509", name: "Pattern Recognition", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Dr. B. Dhanalakshmi" },
  "CSDX513": { code: "CSDX 513", name: "Intrusion Detection and Data Analytics", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Mrs. A. Sulthana Rashya Begam" },

  // Labs & Practical
  "CSD3155": { code: "CSD 3155", name: "Machine Learning Laboratory", type: "Lab", credits: 1, semesterTotal: 15, faculty: "Mrs. M.S. Usha" },
  "CSD3156": { code: "CSD 3156", name: "Data and Security Laboratory", type: "Lab", credits: 1, semesterTotal: 15, faculty: "Mrs. G. Safiya Begam" },
  "CSD3159": { code: "CSD 3159", name: "Internship I", type: "Lab", credits: 1, semesterTotal: 15, faculty: "Mrs. M.S. Usha" },
  "GED3101": { code: "GED 3101", name: "Communication Skills for Career Success", type: "Lab", credits: 1, semesterTotal: 15, faculty: "Dr. S. Sakthivel / Dr. T. Sugadev" }
};

// 7 Registered Crescent Students with Unique Passwords
const INITIAL_STUDENTS = [
  {
    id: "std-1176",
    rrn: "240171601176",
    name: "Shaik Mohamed",
    email: "240171601176@crescent.education",
    password: "student@1176",
    department: "B.Tech AI & DS",
    semester: "Semester V (Sec C)",
    avatar: "SM",
    accentColor: "#3b82f6",
    electives: ["CSDX502", "CSDX513"]
  },
  {
    id: "std-1182",
    rrn: "240171601182",
    name: "Syed Ishaaq",
    email: "240171601182@crescent.education",
    password: "student@1182",
    department: "B.Tech AI & DS",
    semester: "Semester V (Sec C)",
    avatar: "SI",
    accentColor: "#10b981",
    electives: ["CSDX502", "CSDX513"]
  },
  {
    id: "std-1178",
    rrn: "240171601178",
    name: "Shamith Hussain",
    email: "240171601178@crescent.education",
    password: "student@1178",
    department: "B.Tech AI & DS",
    semester: "Semester V (Sec C)",
    avatar: "SH",
    accentColor: "#8b5cf6",
    electives: ["CSDX502", "CSDX513"]
  },
  {
    id: "std-1190",
    rrn: "240171601190",
    name: "Mohamed Nadish",
    email: "240171601190@crescent.education",
    password: "student@1190",
    department: "B.Tech AI & DS",
    semester: "Semester V (Sec C)",
    avatar: "MN",
    accentColor: "#06b6d4",
    electives: ["CSDX502", "CSDX513"]
  },
  {
    id: "std-1189",
    rrn: "240171601189",
    name: "Mohamed Fardeen",
    email: "240171601189@crescent.education",
    password: "student@1189",
    department: "B.Tech AI & DS",
    semester: "Semester V (Sec C)",
    avatar: "MF",
    accentColor: "#ec4899",
    electives: ["CSDX501", "CSDX503"]
  },
  {
    id: "std-1164",
    rrn: "240171601164",
    name: "Mohamed Omer Akhil",
    email: "240171601164@crescent.education",
    password: "student@1164",
    department: "B.Tech AI & DS",
    semester: "Semester V (Sec C)",
    avatar: "OA",
    accentColor: "#f59e0b",
    electives: ["CSDX509", "CSDX501"]
  },
  {
    id: "std-1180",
    rrn: "240171601180",
    name: "Suhail Ahmed Baig",
    email: "240171601180@crescent.education",
    password: "student@1180",
    department: "B.Tech AI & DS",
    semester: "Semester V (Sec C)",
    avatar: "SB",
    accentColor: "#ef4444",
    electives: ["CSDX513", "CSDX509"]
  }
];

// Helper to generate PURE ZERO BASELINE (0 Attended, 0 Conducted = 100% Initial Slate)
function buildStudentSubjects(electiveKeys) {
  const regularKeys = ["CSD3151", "CSD3152", "CSD3153", "CSD3154", "CSD3155", "CSD3156", "CSD3159", "GED3101"];
  const allKeys = [...regularKeys, ...electiveKeys];

  return allKeys.map(key => {
    const course = ALL_COURSES[key];
    return {
      id: key.toLowerCase(),
      code: course.code,
      name: course.name,
      type: course.type,
      credits: course.credits,
      semesterTotal: course.semesterTotal, // 60 for 4-credit, 45 for 3-credit, 15 for 1-credit
      faculty: course.faculty,
      minPercentage: 75,
      attended: 0, // Starts at ZERO!
      total: 0     // Starts at ZERO!
    };
  });
}

// Master Weekly Timetable Grid from College Timetable Sheet
const RAW_WEEKLY_TIMETABLE = {
  Monday: [
    { time: "09:00 AM - 10:40 AM", type: "lab", name: "Web & Security Laboratory (CSD 3152/55/56)", room: "Webtech Lab 1 / Lab 2 / Network Lab", isElective: false },
    { time: "11:00 AM - 11:50 AM", type: "theory", codeKey: "CSD3154", room: "SM 202", isElective: false },
    { time: "11:50 AM - 12:40 PM", type: "theory", codeKey: "CSD3151", room: "SM 202", isElective: false },
    { time: "01:40 PM - 02:30 PM", type: "theory", codeKey: "CSD3153", room: "SM 202", isElective: false },
    { time: "02:30 PM - 04:10 PM", type: "lab", codeKey: "CSD3159", room: "AI & DS Dept Lab", isElective: false }
  ],
  Tuesday: [
    { time: "09:00 AM - 10:40 AM", type: "other", name: "LIB (Library Hour)", room: "Central Library", isElective: false },
    { time: "11:00 AM - 12:40 PM", type: "lab", name: "AI & ML / Security Lab (CSD 3152/55/56)", room: "AI&ML / Research / CC Lab 1", isElective: false },
    { time: "01:40 PM - 02:30 PM", type: "theory", slot: "ELECTIVE_SLOT_1", room: "SM 203", isElective: true, slotGroup: ["CSDX502", "CSDX503", "CSDX509"] },
    { time: "02:30 PM - 03:20 PM", type: "theory", codeKey: "CSD3151", room: "SM 203", isElective: false },
    { time: "03:20 PM - 04:10 PM", type: "theory", codeKey: "CSD3152", room: "SM 203", isElective: false }
  ],
  Wednesday: [
    { time: "09:00 AM - 10:40 AM", type: "lab", codeKey: "GED3101", room: "SM 203", isElective: false },
    { time: "11:00 AM - 11:50 AM", type: "other", name: "SEM (Seminar Hour)", room: "SM 203", isElective: false },
    { time: "11:50 AM - 12:40 PM", type: "theory", codeKey: "CSD3152", room: "SM 203", isElective: false },
    { time: "01:40 PM - 02:30 PM", type: "theory", slot: "ELECTIVE_SLOT_2", room: "SM 203", isElective: true, slotGroup: ["CSDX501", "CSDX507", "CSDX513"] },
    { time: "02:30 PM - 03:20 PM", type: "theory", codeKey: "CSD3154", room: "SM 203", isElective: false },
    { time: "03:20 PM - 04:10 PM", type: "other", name: "LIB (Library Hour)", room: "Central Library", isElective: false }
  ],
  Thursday: [
    { time: "09:00 AM - 09:50 AM", type: "theory", slot: "ELECTIVE_SLOT_1", room: "SM 203", isElective: true, slotGroup: ["CSDX502", "CSDX503", "CSDX509"] },
    { time: "09:50 AM - 10:40 AM", type: "theory", codeKey: "CSD3153", room: "SM 203", isElective: false },
    { time: "11:00 AM - 11:50 AM", type: "theory", codeKey: "CSD3151", room: "SM 203", isElective: false },
    { time: "11:50 AM - 12:40 PM", type: "theory", slot: "ELECTIVE_SLOT_2", room: "SM 203", isElective: true, slotGroup: ["CSDX501", "CSDX507", "CSDX513"] },
    { time: "01:40 PM - 02:30 PM", type: "theory", codeKey: "CSD3152", room: "SM 203", isElective: false },
    { time: "02:30 PM - 04:10 PM", type: "other", name: "SEM (Seminar Hour)", room: "SM 203", isElective: false }
  ],
  Friday: [
    { time: "09:00 AM - 09:50 AM", type: "theory", slot: "ELECTIVE_SLOT_2", room: "SM 203", isElective: true, slotGroup: ["CSDX501", "CSDX507", "CSDX513"] },
    { time: "09:50 AM - 10:40 AM", type: "theory", slot: "ELECTIVE_SLOT_1", room: "SM 203", isElective: true, slotGroup: ["CSDX502", "CSDX503", "CSDX509"] },
    { time: "11:00 AM - 11:50 AM", type: "theory", codeKey: "CSD3154", room: "SM 203", isElective: false },
    { time: "11:50 AM - 12:40 PM", type: "theory", codeKey: "CSD3153", room: "SM 203", isElective: false },
    { time: "01:40 PM - 02:30 PM", type: "other", name: "Jumu'ah Prayer Break", room: "Mosque / Prayer Hall", isElective: false },
    { time: "02:30 PM - 04:10 PM", type: "lab", name: "AI & ML / Security Lab (CSD 3152/55/56)", room: "AI&ML / Research / CC Lab 1", isElective: false }
  ],
  Saturday: [
    { time: "09:30 AM - 11:30 AM", type: "other", name: "Remedial & Project Guidance", room: "SM 203", isElective: false }
  ]
};

// Storage Manager
class AttendanceStore {
  static STORAGE_KEY = "attendance_crescent_v6";
  static ACTIVE_USER_KEY = "active_crescent_user_v6";

  static init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const data = INITIAL_STUDENTS.map(s => {
        const subjects = buildStudentSubjects(s.electives);
        return {
          ...s,
          subjects,
          history: []
        };
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
  }

  static getStudents() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  static saveStudents(students) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(students));
  }

  static getActiveUser() {
    const email = localStorage.getItem(this.ACTIVE_USER_KEY);
    if (!email) return null;

    const students = this.getStudents();
    return students.find(s => s.email.toLowerCase() === email.toLowerCase() || s.rrn.toLowerCase() === email.toLowerCase()) || null;
  }

  static setActiveUserEmail(email) {
    if (!email) {
      localStorage.removeItem(this.ACTIVE_USER_KEY);
    } else {
      localStorage.setItem(this.ACTIVE_USER_KEY, email);
    }
  }

  static logout() {
    localStorage.removeItem(this.ACTIVE_USER_KEY);
  }

  static authenticate(credential, password) {
    const students = this.getStudents();
    const cleanInput = credential.trim().toLowerCase();
    
    const student = students.find(s => 
      s.email.toLowerCase() === cleanInput || 
      s.rrn.toLowerCase() === cleanInput ||
      s.rrn.toLowerCase() === cleanInput.split('@')[0]
    );

    if (!student) {
      return { success: false, message: "Invalid RRN / Educational Email or Password." };
    }

    if (password !== student.password) {
      return { success: false, message: "Invalid Password! Please check your credentials and try again." };
    }

    this.setActiveUserEmail(student.email);
    return { success: true, student };
  }

  // Enhanced Attendance Marking with Custom Date Selection
  static markAttendanceWithDate(studentId, subjectId, isPresent, selectedDateStr, note = "") {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const subject = student.subjects.find(sub => sub.id === subjectId);
    if (!subject) return null;

    subject.total += 1;
    if (isPresent) {
      subject.attended += 1;
    }

    const markDate = selectedDateStr || new Date().toISOString().split("T")[0];
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!student.history) student.history = [];
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: markDate,
      time: nowTimeStr,
      subjectId: subject.id,
      subjectCode: subject.code,
      subjectName: subject.name,
      status: isPresent ? "present" : "absent",
      note: note || (isPresent ? "Marked Present" : "Marked Leave / Absent")
    };
    student.history.unshift(newLog);

    this.saveStudents(students);
    return { student, subject, newLog };
  }

  static undoLogEntry(studentId, logId) {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student || !student.history) return false;

    const logIndex = student.history.findIndex(l => l.id === logId);
    if (logIndex === -1) return false;

    const log = student.history[logIndex];
    const subject = student.subjects.find(sub => sub.id === log.subjectId);
    
    if (subject && subject.total > 0) {
      subject.total -= 1;
      if (log.status === "present" && subject.attended > 0) {
        subject.attended -= 1;
      }
    }

    student.history.splice(logIndex, 1);
    this.saveStudents(students);
    return true;
  }

  static addSubject(studentId, newSubjectData) {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return false;

    const credits = parseInt(newSubjectData.credits) || 3;
    const semTotal = credits === 4 ? 60 : (credits === 3 ? 45 : 15);

    const newSub = {
      id: `custom-${Date.now()}`,
      code: newSubjectData.code.toUpperCase(),
      name: newSubjectData.name,
      minPercentage: parseInt(newSubjectData.minPercentage) || 75,
      attended: 0,
      total: 0,
      credits: credits,
      semesterTotal: semTotal,
      type: "Custom",
      faculty: "Faculty"
    };

    student.subjects.push(newSub);
    this.saveStudents(students);
    return newSub;
  }

  static deleteSubject(studentId, subjectId) {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return false;

    student.subjects = student.subjects.filter(s => s.id !== subjectId);
    this.saveStudents(students);
    return true;
  }
}

// Global Calculations Math Helpers
const AttendanceMath = {
  calculatePercentage(attended, total) {
    if (!total || total === 0) return 100; // 0 conducted classes = 100% baseline!
    return parseFloat(((attended / total) * 100).toFixed(1));
  },

  calculateOverall(subjects) {
    if (!subjects || subjects.length === 0) return { percentage: 100, attended: 0, total: 0, missed: 0 };
    const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
    const totalHeld = subjects.reduce((sum, s) => sum + s.total, 0);
    const totalMissed = totalHeld - totalAttended;
    const percentage = totalHeld > 0 ? parseFloat(((totalAttended / totalHeld) * 100).toFixed(1)) : 100;
    
    return {
      percentage,
      attended: totalAttended,
      total: totalHeld,
      missed: totalMissed
    };
  },

  getStatusCategory(percentage, minTarget = 75) {
    if (percentage < minTarget) return "DANGER";
    if (percentage < minTarget + 4) return "WARNING";
    return "SAFE";
  },

  calculateSafeSkips(attended, total, minTarget = 75) {
    const target = minTarget / 100;
    if (total === 0) return 0;
    const safeSkips = Math.floor((attended - target * total) / target);
    return Math.max(0, safeSkips);
  },

  calculateRequiredClasses(attended, total, minTarget = 75) {
    const target = minTarget / 100;
    const currentPct = total > 0 ? (attended / total) : 1;
    if (currentPct >= target) return 0;

    const required = Math.ceil((target * total - attended) / (1 - target));
    return Math.max(0, required);
  },

  calculateMaxSemesterBunks(semesterTotal, minTarget = 75) {
    const minRequiredAttended = Math.ceil((minTarget / 100) * semesterTotal);
    return semesterTotal - minRequiredAttended;
  },

  simulateLeaves(attended, total, upcomingLeaves, minTarget = 75) {
    const newTotal = total + upcomingLeaves;
    const newAttended = attended;
    const newPct = parseFloat(((newAttended / newTotal) * 100).toFixed(1));
    const isSafe = newPct >= minTarget;
    const dropAmount = parseFloat(((attended / total * 100) - newPct).toFixed(1));

    return {
      newTotal,
      newAttended,
      newPct,
      isSafe,
      dropAmount,
      statusCategory: this.getStatusCategory(newPct, minTarget)
    };
  }
};
