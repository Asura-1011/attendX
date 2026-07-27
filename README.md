# AttendX Pro - College Attendance Tracker & Leave Predictor
Powered Exclusively by **Supabase Database** (B.Tech AI & DS - Semester V Sec C)

---

## 🚀 Quick Setup Instructions

### Step 1: Set Up Supabase Database
1. Go to [Supabase Dashboard](https://supabase.com) and create a new project.
2. Open the **SQL Editor** tab in your Supabase project dashboard.
3. Open the included `schema.sql` file from this project, copy all contents, paste it into the Supabase SQL Editor, and click **Run**.
4. This will create the required `students`, `subjects`, and `history_logs` tables with complete RLS security policies and initial seed data for all 7 Crescent students.

---

### Step 2: Configure Supabase API Keys
1. In your Supabase Dashboard, go to **Project Settings** -> **API**.
2. Copy your **Project URL** and **`anon` `public` key**.
3. Open `config.js` in this project and paste your keys:

```javascript
window.ENV = {
  SUPABASE_URL: "YOUR_SUPABASE_PROJECT_URL",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_PUBLIC_KEY"
};
```

---

### Step 3: Deploy on Vercel / Netlify / GitHub Pages
1. Push this repository to GitHub or upload `crescent-attendance-app.zip` to Netlify / Vercel.
2. The application will run 100% on Supabase backend with instant cross-device live synchronization across Mobile, Laptop, and PC!

---

## 🔑 Registered Student Test Credentials

| Student Name | Educational Email / RRN | Password |
|---|---|---|
| **Shaik Mohamed** | `240171601176` or `240171601176@crescent.education` | `student@1176` |
| **Syed Ishaaq** | `240171601182` or `240171601182@crescent.education` | `student@1182` |
| **Shamith Hussain** | `240171601178` or `240171601178@crescent.education` | `student@1178` |
| **Mohamed Nadish** | `240171601190` or `240171601190@crescent.education` | `student@1190` |
| **Mohamed Fardeen** | `240171601189` or `240171601189@crescent.education` | `student@1189` |
| **Mohamed Omer Akhil** | `240171601164` or `240171601164@crescent.education` | `student@1164` |
| **Suhail Ahmed Baig** | `240171601180` or `240171601180@crescent.education` | `student@1180` |
