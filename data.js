/**
 * Crescent Institute of Science & Technology (B.Tech AI & DS - Semester V Section C)
 * Core Data Handler - Exclusively Integrated with Supabase Database Backend
 */

// All Available Courses in Curriculum with Credit Capacities:
const ALL_COURSES = {
  "CSD3151": { code: "CSD 3151", name: "Data and Network Security", type: "Regular", credits: 3, semesterTotal: 45, faculty: "Mrs. G. Safiya Begam" },
  "CSD3152": { code: "CSD 3152", name: "Cloud Computing Services", type: "Regular", credits: 4, semesterTotal: 60, faculty: "Dr. G. Aarthi" },
  "CSD3153": { code: "CSD 3153", name: "Automata Theory", type: "Regular", credits: 3, semesterTotal: 45, faculty: "Mrs. A. Sulthana Rashya Begam" },
  "CSD3154": { code: "CSD 3154", name: "Machine Learning Techniques", type: "Regular", credits: 3, semesterTotal: 45, faculty: "Mrs. M.S. Usha" },

  "CSDX501": { code: "CSDX 501", name: "Web and Social Media Mining", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Faculty 8" },
  "CSDX502": { code: "CSDX 502", name: "Artificial Neural Networks", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Dr. S. Revathi" },
  "CSDX503": { code: "CSDX 503", name: "Artificial Intelligence based Web Application", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Mrs. A. Nazreen" },
  "CSDX507": { code: "CSDX 507", name: "Decision Making for Data Science", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Mrs. K. Sowmiya" },
  "CSDX509": { code: "CSDX 509", name: "Pattern Recognition", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Dr. B. Dhanalakshmi" },
  "CSDX513": { code: "CSDX 513", name: "Intrusion Detection and Data Analytics", type: "Elective", credits: 3, semesterTotal: 45, faculty: "Mrs. A. Sulthana Rashya Begam" },

  "CSD3155": { code: "CSD 3155", name: "Machine Learning Laboratory", type: "Lab", credits: 1, semesterTotal: 15, faculty: "Mrs. M.S. Usha" },
  "CSD3156": { code: "CSD 3156", name: "Data and Security Laboratory", type: "Lab", credits: 1, semesterTotal: 15, faculty: "Mrs. G. Safiya Begam" },
  "CSD3159": { code: "CSD 3159", name: "Internship I", type: "Lab", credits: 1, semesterTotal: 15, faculty: "Mrs. M.S. Usha" },
  "GED3101": { code: "GED 3101", name: "Communication Skills for Career Success", type: "Lab", credits: 1, semesterTotal: 15, faculty: "Dr. S. Sakthivel / Dr. T. Sugadev" }
};

// 7 Registered Crescent Students Initial Seed Data
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
    electives: ["CSDX502", "CSDX513"],
    lastUpdated: Date.now()
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
    electives: ["CSDX502", "CSDX513"],
    lastUpdated: Date.now()
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
    electives: ["CSDX502", "CSDX513"],
    lastUpdated: Date.now()
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
    electives: ["CSDX502", "CSDX513"],
    lastUpdated: Date.now()
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
    electives: ["CSDX501", "CSDX503"],
    lastUpdated: Date.now()
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
    electives: ["CSDX509", "CSDX501"],
    lastUpdated: Date.now()
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
    electives: ["CSDX513", "CSDX509"],
    lastUpdated: Date.now()
  }
];

function buildStudentSubjects(electiveKeys) {
  const regularKeys = ["CSD3151", "CSD3152", "CSD3153", "CSD3154", "CSD3155", "CSD3156", "CSD3159", "GED3101"];
  const allKeys = [...regularKeys, ...(electiveKeys || [])];

  return allKeys.map(key => {
    const course = ALL_COURSES[key];
    const semTotal = course ? course.semesterTotal : 45;

    return {
      id: key.toLowerCase(),
      code: course ? course.code : key,
      name: course ? course.name : key,
      type: course ? course.type : "Regular",
      credits: course ? course.credits : 3,
      semesterTotal: semTotal,
      faculty: course ? course.faculty : "Faculty",
      minPercentage: 75,
      total: semTotal,
      attended: semTotal,
      missed: 0
    };
  });
}

// Master Weekly Timetable Grid
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

// Pure Supabase Backend Database Store (No localStorage primary storage, No JSONBin, No HTTP fallbacks)
class AttendanceStore {
  static ACTIVE_USER_KEY = "crescent_active_session_supabase";
  static memoryStudentsCache = null;
  static isLastSyncSuccess = true;

  // Supabase REST Helper
  static getSupabase() {
    if (window.supabaseClient) {
      return window.supabaseClient;
    }
    if (window.supabase && window.supabase.createClient && window.ENV) {
      window.supabaseClient = window.supabase.createClient(window.ENV.SUPABASE_URL, window.ENV.SUPABASE_ANON_KEY);
      return window.supabaseClient;
    }
    return null;
  }

  // Fetch all students, subjects, and history directly from Supabase Database
  static async fetchFromCloud(onSyncCallback) {
    const client = this.getSupabase();
    if (!client) {
      this.isLastSyncSuccess = false;
      return false;
    }

    try {
      // 1. Fetch Students
      const { data: studentsData, error: stdErr } = await client
        .from('students')
        .select('*');

      if (stdErr || !studentsData) {
        throw stdErr || new Error("Failed to fetch students from Supabase");
      }

      // 2. Fetch Subjects
      const { data: subjectsData } = await client
        .from('subjects')
        .select('*');

      // 3. Fetch History Logs
      const { data: historyData } = await client
        .from('history_logs')
        .select('*')
        .order('created_at', { ascending: false });

      // Combine relational data into student objects
      const compiledStudents = studentsData.map(std => {
        const electivesParsed = typeof std.electives === 'string' ? JSON.parse(std.electives) : (std.electives || []);
        
        let stdSubjects = (subjectsData || [])
          .filter(sub => sub.student_id === std.id)
          .map(sub => ({
            id: sub.id,
            code: sub.code,
            name: sub.name,
            type: sub.type,
            credits: sub.credits,
            semesterTotal: sub.semester_total,
            faculty: sub.faculty,
            minPercentage: sub.min_percentage,
            total: sub.total,
            attended: sub.attended,
            missed: sub.missed
          }));

        if (stdSubjects.length === 0) {
          stdSubjects = buildStudentSubjects(electivesParsed);
        }

        const stdHistory = (historyData || [])
          .filter(h => h.student_id === std.id)
          .map(h => ({
            id: h.id,
            date: h.date,
            time: h.time,
            subjectId: h.subject_id,
            subjectCode: h.subject_code,
            subjectName: h.subject_name,
            status: h.status,
            note: h.note
          }));

        return {
          id: std.id,
          rrn: std.rrn,
          name: std.name,
          email: std.email,
          password: std.password,
          department: std.department,
          semester: std.semester,
          avatar: std.avatar,
          accentColor: std.accent_color,
          electives: electivesParsed,
          subjects: stdSubjects,
          history: stdHistory
        };
      });

      this.memoryStudentsCache = compiledStudents;
      this.isLastSyncSuccess = true;
      if (onSyncCallback) onSyncCallback(compiledStudents);
      return true;
    } catch (e) {
      console.warn("Supabase fetch fallback to memory cache:", e);
      this.isLastSyncSuccess = false;

      if (!this.memoryStudentsCache) {
        this.memoryStudentsCache = INITIAL_STUDENTS.map(s => ({
          ...s,
          subjects: buildStudentSubjects(s.electives),
          history: []
        }));
      }
      return false;
    }
  }

  static getStudents() {
    if (!this.memoryStudentsCache) {
      this.memoryStudentsCache = INITIAL_STUDENTS.map(s => ({
        ...s,
        subjects: buildStudentSubjects(s.electives),
        history: []
      }));
    }
    return this.memoryStudentsCache;
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
    const cleanInput = (credential || "").trim().toLowerCase();
    
    const student = students.find(s => 
      (s.email && s.email.toLowerCase() === cleanInput) || 
      (s.rrn && s.rrn.toLowerCase() === cleanInput) ||
      (s.rrn && s.rrn.toLowerCase() === cleanInput.split('@')[0])
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

  // Get max allowed entries for a subject on a specific date based on customized student lab timetable
  static getMaxEntriesForSubjectOnDate(studentId, subjectId, dateStr) {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return 1;

    const subject = student.subjects.find(sub => sub.id === subjectId);
    if (!subject) return 1;

    const targetDate = dateStr || new Date().toISOString().split("T")[0];
    const dateObj = new Date(targetDate + "T00:00:00");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[dateObj.getDay()];

    const codeClean = (subject.code || "").toUpperCase().replace(/\s+/g, "");

    // Student Grouping:
    // Shaik Mohamed (std-1176) & Mohamed Omer Akhil (std-1164) vs Rest of Students
    const isShaikOrAkhil = (student.id === "std-1176" || student.id === "std-1164" || student.rrn === "240171601176" || student.rrn === "240171601164");

    if (dayName === "Monday") {
      if (codeClean.includes("CSD3159")) return 2;
      if (isShaikOrAkhil) {
        if (codeClean.includes("CSD3155")) return 2;
      } else {
        if (codeClean.includes("CSD3156")) return 2;
      }
    }

    if (dayName === "Tuesday") {
      if (isShaikOrAkhil) {
        if (codeClean.includes("CSD3156")) return 2;
        if (codeClean.includes("CSD3152")) return 1;
      } else {
        if (codeClean.includes("CSD3152")) return 3; // 2 for Lab + 1 for Theory = 3 Entries!
      }
    }

    if (dayName === "Wednesday") {
      if (codeClean.includes("GED3101")) return 2;
    }

    if (dayName === "Friday") {
      if (isShaikOrAkhil) {
        if (codeClean.includes("CSD3152")) return 2;
      } else {
        if (codeClean.includes("CSD3155")) return 2;
      }
    }

    return 1;
  }

  // Get subject history logs for a specific date
  static getSubjectLogsForDate(studentId, subjectId, dateStr) {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student || !student.history) return [];

    const targetDate = dateStr || new Date().toISOString().split("T")[0];
    return student.history.filter(l => l.subjectId === subjectId && l.date === targetDate);
  }

  // Anti-Cheating Lock Check for Date
  static isSubjectLockedForDate(studentId, subjectId, dateStr) {
    const targetDate = dateStr || new Date().toISOString().split("T")[0];
    const maxAllowed = this.getMaxEntriesForSubjectOnDate(studentId, subjectId, targetDate);
    const existingLogs = this.getSubjectLogsForDate(studentId, subjectId, targetDate);

    if (existingLogs.length >= maxAllowed) {
      return {
        isLocked: true,
        count: existingLogs.length,
        maxAllowed,
        latestLog: existingLogs[0],
        status: existingLogs[0]?.status || "logged"
      };
    }

    return {
      isLocked: false,
      count: existingLogs.length,
      maxAllowed,
      latestLog: existingLogs[0] || null,
      status: null
    };
  }

  // Attendance Marking - Direct Supabase Insert & Update
  static async markAttendanceWithDate(studentId, subjectId, isPresent, selectedDateStr, note = "") {
    const client = this.getSupabase();
    const markDate = selectedDateStr || new Date().toISOString().split("T")[0];

    const lockStatus = this.isSubjectLockedForDate(studentId, subjectId, markDate);
    if (lockStatus.isLocked) {
      return {
        isLocked: true,
        message: `Maximum allowed entries (${lockStatus.maxAllowed}/${lockStatus.maxAllowed}) for this subject on ${markDate} have already been logged. Click "Undo & Re-mark" directly on the subject card to change it.`
      };
    }

    const student = this.getStudents().find(s => s.id === studentId);
    if (!student) return null;

    const subject = student.subjects.find(sub => sub.id === subjectId);
    if (!subject) return null;

    if (typeof subject.missed !== 'number') subject.missed = 0;

    if (!isPresent) {
      subject.missed += 1;
      subject.attended = Math.max(0, subject.total - subject.missed);
    } else {
      subject.attended = Math.min(subject.total, subject.total - subject.missed);
    }

    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const entryNumber = lockStatus.count + 1;
    const periodLabel = lockStatus.maxAllowed > 1 ? ` (Period ${entryNumber}/${lockStatus.maxAllowed})` : '';

    const newLogId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const logNote = note || (isPresent ? `Attended Class${periodLabel} / Confirmed` : `Marked Absence${periodLabel} / Leave`);

    const newLog = {
      id: newLogId,
      date: markDate,
      time: nowTimeStr,
      subjectId: subject.id,
      subjectCode: subject.code,
      subjectName: subject.name,
      status: isPresent ? "present" : "absent",
      note: logNote
    };

    student.history.unshift(newLog);

    // 1. Update Supabase Subjects table
    if (client) {
      try {
        await client.from('subjects').upsert({
          id: subject.id.includes(studentId) ? subject.id : `${studentId}-${subject.id}`,
          student_id: studentId,
          code: subject.code,
          name: subject.name,
          type: subject.type || 'Regular',
          credits: subject.credits || 3,
          semester_total: subject.semesterTotal || 45,
          faculty: subject.faculty || 'Faculty',
          min_percentage: subject.minPercentage || 75,
          total: subject.total,
          attended: subject.attended,
          missed: subject.missed
        });

        // 2. Insert into Supabase History Logs table
        await client.from('history_logs').insert({
          id: newLogId,
          student_id: studentId,
          subject_id: subject.id,
          subject_code: subject.code,
          subject_name: subject.name,
          date: markDate,
          time: nowTimeStr,
          status: isPresent ? "present" : "absent",
          note: logNote
        });
      } catch (err) {
        console.warn("Supabase mutation warning:", err);
      }
    }

    return { student, subject, newLog, isLocked: false, entryNumber, maxAllowed: lockStatus.maxAllowed };
  }

  // Direct Card Undo: Reverts log from Supabase
  static async undoLatestSubjectMark(studentId, subjectId) {
    const student = this.getStudents().find(s => s.id === studentId);
    if (!student || !student.history) return false;

    const logIndex = student.history.findIndex(l => l.subjectId === subjectId);
    if (logIndex === -1) return false;

    const log = student.history[logIndex];
    return await this.undoLogEntry(studentId, log.id);
  }

  static async undoLogEntry(studentId, logId) {
    const client = this.getSupabase();
    const student = this.getStudents().find(s => s.id === studentId);
    if (!student || !student.history) return false;

    const logIndex = student.history.findIndex(l => l.id === logId);
    if (logIndex === -1) return false;

    const log = student.history[logIndex];
    const subject = student.subjects.find(sub => sub.id === log.subjectId);
    
    if (subject) {
      if (log.status === "absent" && subject.missed > 0) {
        subject.missed -= 1;
        subject.attended = Math.min(subject.total, subject.total - subject.missed);
      }
    }

    student.history.splice(logIndex, 1);

    // Delete log and update subject in Supabase Database
    if (client) {
      try {
        await client.from('history_logs').delete().eq('id', logId);
        if (subject) {
          await client.from('subjects').upsert({
            id: subject.id.includes(studentId) ? subject.id : `${studentId}-${subject.id}`,
            student_id: studentId,
            code: subject.code,
            name: subject.name,
            total: subject.total,
            attended: subject.attended,
            missed: subject.missed
          });
        }
      } catch (err) {
        console.warn("Supabase delete warning:", err);
      }
    }

    return true;
  }

  static async addSubject(studentId, newSubjectData) {
    const client = this.getSupabase();
    const student = this.getStudents().find(s => s.id === studentId);
    if (!student) return false;

    const credits = parseInt(newSubjectData.credits) || 3;
    const semTotal = credits === 4 ? 60 : (credits === 3 ? 45 : 15);
    const subId = `${studentId}-custom-${Date.now()}`;

    const newSub = {
      id: subId,
      code: newSubjectData.code.toUpperCase(),
      name: newSubjectData.name,
      minPercentage: parseInt(newSubjectData.minPercentage) || 75,
      total: semTotal,
      attended: semTotal,
      missed: 0,
      credits: credits,
      semesterTotal: semTotal,
      type: "Custom",
      faculty: "Faculty"
    };

    student.subjects.push(newSub);

    if (client) {
      try {
        await client.from('subjects').insert({
          id: subId,
          student_id: studentId,
          code: newSub.code,
          name: newSub.name,
          type: "Custom",
          credits: credits,
          semester_total: semTotal,
          faculty: "Faculty",
          min_percentage: newSub.minPercentage,
          total: semTotal,
          attended: semTotal,
          missed: 0
        });
      } catch (e) {}
    }

    return newSub;
  }

  static async deleteSubject(studentId, subjectId) {
    const client = this.getSupabase();
    const student = this.getStudents().find(s => s.id === studentId);
    if (!student) return false;

    student.subjects = student.subjects.filter(s => s.id !== subjectId);

    if (client) {
      try {
        await client.from('subjects').delete().eq('id', subjectId);
      } catch (e) {}
    }

    return true;
  }
}

// Global Calculations Math Helpers
const AttendanceMath = {
  calculatePercentage(attended, total) {
    if (!total || total === 0) return 100;
    return parseFloat(((attended / total) * 100).toFixed(1));
  },

  calculateOverall(subjects) {
    if (!subjects || subjects.length === 0) return { percentage: 100, attended: 0, total: 0, missed: 0 };
    const totalAttended = subjects.reduce((sum, s) => sum + (s.attended !== undefined ? s.attended : s.total), 0);
    const totalCapacity = subjects.reduce((sum, s) => sum + s.total, 0);
    const totalMissed = subjects.reduce((sum, s) => sum + (s.missed || 0), 0);
    const percentage = totalCapacity > 0 ? parseFloat(((totalAttended / totalCapacity) * 100).toFixed(1)) : 100;
    
    return {
      percentage,
      attended: totalAttended,
      total: totalCapacity,
      missed: totalMissed
    };
  },

  getStatusCategory(percentage, minTarget = 75) {
    if (percentage < minTarget) return "DANGER";
    if (percentage < minTarget + 4) return "WARNING";
    return "SAFE";
  },

  calculateSafeSkips(attended, total, minTarget = 75) {
    const minRequiredAttended = Math.ceil((minTarget / 100) * total);
    const safeSkips = attended - minRequiredAttended;
    return Math.max(0, safeSkips);
  },

  calculateRequiredClasses(attended, total, minTarget = 75) {
    const target = minTarget / 100;
    const currentPct = (attended / total);
    if (currentPct >= target) return 0;

    const required = Math.ceil((target * total - attended) / (1 - target));
    return Math.max(0, required);
  },

  calculateMaxSemesterBunks(semesterTotal, minTarget = 75) {
    const minRequiredAttended = Math.ceil((minTarget / 100) * semesterTotal);
    return semesterTotal - minRequiredAttended;
  },

  simulateLeaves(attended, total, upcomingLeaves, minTarget = 75) {
    const newAttended = Math.max(0, attended - upcomingLeaves);
    const newPct = parseFloat(((newAttended / total) * 100).toFixed(1));
    const isSafe = newPct >= minTarget;
    const dropAmount = parseFloat((((attended / total) * 100) - newPct).toFixed(1));

    return {
      newTotal: total,
      newAttended,
      newPct,
      isSafe,
      dropAmount,
      statusCategory: this.getStatusCategory(newPct, minTarget)
    };
  }
};
