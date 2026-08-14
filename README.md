```markdown
# 🏫 AIM Habiganj - Comprehensive Madrasah Management System

![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)
![Tech Stack](https://img.shields.io/badge/Tech-Next.js%20%7C%20Node.js%20%7C%20MongoDB-blue)

**Live Project:** [https://aibhabiganj.vercel.app](https://aibhabiganj.vercel.app)

**AIM Habiganj** (As-Salam Ideal Madrasah) is a robust, full-stack educational management platform designed to digitize, streamline, and automate the day-to-day operations of modern schools and madrasahs. 

---

## 🎯 The Problem: Why This Project Exists?
Most traditional educational institutions rely heavily on manual, paper-based workflows. This creates several major bottlenecks that hinder institutional growth:
1. **Time-Consuming Administrative Work:** Creating hundreds of student ID cards, seat plans, and testimonials manually takes weeks of repetitive labor.
2. **Complex Result Processing:** Teachers manually calculating grades is prone to human error, and distributing physical report cards is inefficient for both staff and parents.
3. **Financial Mismanagement:** Tracking tuition fees, admission fees, and other expenses on paper ledgers often leads to financial discrepancies and lost records.
4. **Communication Gap:** Parents struggle to get instant updates about their child’s progress, class routines, or immediate answers to institutional queries.
5. **Scattered Academic Data:** Physical attendance registers and offline files are easily lost, making data retrieval extremely slow.

## 💡 The Solution: How AIM Habiganj Solves These Issues
This platform acts as a **centralized digital ecosystem** that brings administration, teachers, students, and parents under one seamless system. 

By automating repetitive administrative tasks, it saves **hundreds of administrative hours** per academic year, ensures data accuracy, and drastically improves the communication bridge between the institution and the community. This project demonstrates my ability to identify real-world business logic problems and solve them using modern web technologies.

---

### ✨ Key Features & Modules

**1. Core Administration & Student Management**
* **Digital Admission:** Seamless online admission and profile management for students.
* **1-Click ID Card Generator:** Pulls data directly from the database to generate production-ready, printable digital student ID cards instantly.
* **Academic Documents:** Automated generation of Digital Testimonials and Seat Plans.

**2. Academic & Result Processing**
* **Smart Result System:** Teachers can input marks digitally. The backend securely processes the data to generate class-wise reports.
* **Online Result Search:** Students and parents can easily search and download their exam results online using their credentials.
* **Digital Attendance & Routines:** Daily attendance tracking and easily accessible digital exam/class routines.

**3. Financial Management**
* **Fee Collection System:** A secure backend module to track tuition fees, admission fees, and overall financial calculations.

**4. Community & Communication**
* **AI Chatbot Integration:** A 24/7 automated assistant on the homepage to instantly answer general queries regarding admissions and routines.
* **WhatsApp Integration:** Direct WhatsApp button for real-time communication between parents and the madrasah authority.
* **Parents' Corner & Multimedia Gallery:** A dedicated space for parents, alongside a gallery for uploading online classes and event photos to keep the community engaged.
* **Localized UI:** Fully customized with professional Bangla typography and a culturally appropriate, responsive design to ensure accessibility for local users.

---

## 💻 Tech Stack
This project is built utilizing a modern, scalable JavaScript ecosystem:

**Frontend:**
* **React.js & Next.js** (For Server-Side Rendering and optimal performance)
* **Tailwind CSS** (For highly responsive, modern UI design)
* HTML5 / CSS3

**Backend:**
* **Node.js & Express.js** (For building robust RESTful APIs and business logic)

**Database & Deployment:**
* **MongoDB Atlas** (Cloud Database for secure and flexible data storage)
* **Vercel** (For seamless continuous deployment and hosting)

---

## 🚀 Getting Started (Run Locally)

Clone the repository and run it locally to see the project in action:

```bash
# Clone the repository
git clone https://github.com/sheikh-muzammil2026/aimhabiganj.git

# Navigate to the project directory
cd aimhabiganj

# Install dependencies
npm install

# Set up environment variables
# Create a .env file in the root directory and add your MongoDB URI, API keys, etc.

MONGODB_URI="your_mongodb_uri"
BETTER_AUTH_URL="your_client_uri"
GEMINI_API_KEY="your_gemini_key"
BETTER_AUTH_SECRET="your_better_auth_secret"
NEXT_PUBLIC_SERVER_API="your_server_api"
NEXT_PUBLIC_IMGBB_API_KEY="your_imagebb_key"

# Start the development server
npm run dev
```
