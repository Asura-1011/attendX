-- ====================================================================
-- Crescent Institute of Science & Technology (B.Tech AI & DS Sec C)
-- Complete Supabase Database Schema & Initial Data Seed
-- ====================================================================

-- 1. Drop existing tables if re-creating
DROP TABLE IF EXISTS history_logs CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- 2. Create Students Table
CREATE TABLE students (
  id VARCHAR(50) PRIMARY KEY,
  rrn VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL DEFAULT 'B.Tech AI & DS',
  semester VARCHAR(50) NOT NULL DEFAULT 'Semester V (Sec C)',
  avatar VARCHAR(10) NOT NULL,
  accent_color VARCHAR(20) NOT NULL DEFAULT '#3b82f6',
  electives JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Subjects Table
CREATE TABLE subjects (
  id VARCHAR(100) PRIMARY KEY,
  student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(30) NOT NULL DEFAULT 'Regular',
  credits INT NOT NULL DEFAULT 3,
  semester_total INT NOT NULL DEFAULT 45,
  faculty VARCHAR(100) NOT NULL DEFAULT 'Faculty',
  min_percentage INT NOT NULL DEFAULT 75,
  total INT NOT NULL DEFAULT 45,
  attended INT NOT NULL DEFAULT 45,
  missed INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create History Logs Table
CREATE TABLE history_logs (
  id VARCHAR(100) PRIMARY KEY,
  student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
  subject_id VARCHAR(100) NOT NULL,
  subject_code VARCHAR(20) NOT NULL,
  subject_name VARCHAR(150) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS) & Public Access Policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read students" ON students FOR SELECT USING (true);
CREATE POLICY "Allow public insert students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update students" ON students FOR UPDATE USING (true);

CREATE POLICY "Allow public read subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Allow public insert subjects" ON subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update subjects" ON subjects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete subjects" ON subjects FOR DELETE USING (true);

CREATE POLICY "Allow public read history" ON history_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert history" ON history_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update history" ON history_logs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete history" ON history_logs FOR DELETE USING (true);

-- 6. Insert Initial 7 Crescent Students
INSERT INTO students (id, rrn, name, email, password, department, semester, avatar, accent_color, electives) VALUES
('std-1176', '240171601176', 'Shaik Mohamed', '240171601176@crescent.education', 'student@1176', 'B.Tech AI & DS', 'Semester V (Sec C)', 'SM', '#3b82f6', '["CSDX502", "CSDX513"]'::jsonb),
('std-1182', '240171601182', 'Syed Ishaaq', '240171601182@crescent.education', 'student@1182', 'B.Tech AI & DS', 'Semester V (Sec C)', 'SI', '#10b981', '["CSDX502", "CSDX513"]'::jsonb),
('std-1178', '240171601178', 'Shamith Hussain', '240171601178@crescent.education', 'student@1178', 'B.Tech AI & DS', 'Semester V (Sec C)', 'SH', '#8b5cf6', '["CSDX502", "CSDX513"]'::jsonb),
('std-1190', '240171601190', 'Mohamed Nadish', '240171601190@crescent.education', 'student@1190', 'B.Tech AI & DS', 'Semester V (Sec C)', 'MN', '#06b6d4', '["CSDX502", "CSDX513"]'::jsonb),
('std-1189', '240171601189', 'Mohamed Fardeen', '240171601189@crescent.education', 'student@1189', 'B.Tech AI & DS', 'Semester V (Sec C)', 'MF', '#ec4899', '["CSDX501", "CSDX503"]'::jsonb),
('std-1164', '240171601164', 'Mohamed Omer Akhil', '240171601164@crescent.education', 'student@1164', 'B.Tech AI & DS', 'Semester V (Sec C)', 'OA', '#f59e0b', '["CSDX509", "CSDX501"]'::jsonb),
('std-1180', '240171601180', 'Suhail Ahmed Baig', '240171601180@crescent.education', 'student@1180', 'B.Tech AI & DS', 'Semester V (Sec C)', 'SB', '#ef4444', '["CSDX513", "CSDX509"]'::jsonb);

-- 7. Seed Initial Subjects for Shaik Mohamed (std-1176)
INSERT INTO subjects (id, student_id, code, name, type, credits, semester_total, faculty, min_percentage, total, attended, missed) VALUES
('std-1176-csd3151', 'std-1176', 'CSD 3151', 'Data and Network Security', 'Regular', 3, 45, 'Mrs. G. Safiya Begam', 75, 45, 45, 0),
('std-1176-csd3152', 'std-1176', 'CSD 3152', 'Cloud Computing Services', 'Regular', 4, 60, 'Dr. G. Aarthi', 75, 60, 60, 0),
('std-1176-csd3153', 'std-1176', 'CSD 3153', 'Automata Theory', 'Regular', 3, 45, 'Mrs. A. Sulthana Rashya Begam', 75, 45, 45, 0),
('std-1176-csd3154', 'std-1176', 'CSD 3154', 'Machine Learning Techniques', 'Regular', 3, 45, 'Mrs. M.S. Usha', 75, 45, 45, 0),
('std-1176-csdx502', 'std-1176', 'CSDX 502', 'Artificial Neural Networks', 'Elective', 3, 45, 'Dr. S. Revathi', 75, 45, 45, 0),
('std-1176-csdx513', 'std-1176', 'CSDX 513', 'Intrusion Detection and Data Analytics', 'Elective', 3, 45, 'Mrs. A. Sulthana Rashya Begam', 75, 45, 45, 0),
('std-1176-csd3155', 'std-1176', 'CSD 3155', 'Machine Learning Laboratory', 'Lab', 1, 15, 'Mrs. M.S. Usha', 75, 15, 15, 0),
('std-1176-csd3156', 'std-1176', 'CSD 3156', 'Data and Security Laboratory', 'Lab', 1, 15, 'Mrs. G. Safiya Begam', 75, 15, 15, 0),
('std-1176-csd3159', 'std-1176', 'CSD 3159', 'Internship I', 'Lab', 1, 15, 'Mrs. M.S. Usha', 75, 15, 15, 0),
('std-1176-ged3101', 'std-1176', 'GED 3101', 'Communication Skills for Career Success', 'Lab', 1, 15, 'Dr. S. Sakthivel / Dr. T. Sugadev', 75, 15, 15, 0);
