# 🎓 IATS CONNECT

**IATS CONNECT** is an interactive web platform designed exclusively for academic collaboration among students at the *Institute of Advanced Technology & Studies*. It allows students to connect in real-time, find study partners using course syllabus codes, stay updated with campus events, and participate in moderated departmental forums.

---

## 🚀 Key Features

- **Study Partner Finder:** Filter and connect with classmates sharing your exact section codes or revision topics.
- **Academic Event Board:** A dedicated space to publish programming sprints, engineering workshops, and student-led revision sessions.
- **Departmental Forums:** Focused discussion channels for Computing, Health Sciences, Business, and Law.
- **Academic Content Filter:** An integrated security system that automatically flags and blocks inappropriate content or spam, adhering strictly to the IATS Code of Conduct.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Responsive UI with built-in student dashboard), and TypeScript / JavaScript.
- **Build Tool:** [Vite](https://vitejs.dev) for fast and efficient project bundling.
- **Backend & Database:** [Supabase](https://supabase.com) (Passwordless email token authentication and PostgreSQL relational database).

---

## 💻 Local Installation & Setup

Follow these steps to clone and run the development environment on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com
cd IATS-CONNECT-UVTAB
```

### 2. Install dependencies
Make sure you have [Node.js](https://nodejs.org) installed. Then run:
```bash
npm install
```

### 3. Environment Variables (IMPORTANT ⚠️)
To protect platform integrity and prevent credential leaks, **do not hardcode database keys directly into the source files**.

1. Duplicate the `.env.example` file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and insert your private Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 4. Run the development server
```bash
npm run dev
```
Open the local link provided by Vite (usually `http://localhost:5173`) in your web browser.

---

## 🤖 AI-Powered Support

This repository integrates **chatgpt-c00lkidd**, an automated AI assistant. If you require technical assistance with code refactoring, securing your environment variables, or adding new features:
1. Review the instructions inside the `chatgpt-prompt.txt` file.
2. Log your specific feature requirements inside that file so the AI can safely process the changes across subsequent commits.

---

## ⚖️ License & Code of Conduct

This project is governed by the academic integrity statutes of the **Institute of Advanced Technology & Studies**. Using this platform for commercial solicitation, distributing copyrighted materials without authorization, or transmitting explicit media is strictly prohibited and subject to disciplinary action.
