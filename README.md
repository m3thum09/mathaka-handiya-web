# 🎸 SLTC Mathaka Handiya - Official Ticketing & Payment System

An automated end-to-end ticketing and reservation platform developed for the **Mathaka Handiya Live in Concert** at SLTC. This platform was designed to streamline student registrations, secure payment verification and provide real-time attendance tracking to support efficient event management.

---

## 📌 Project Overview

This system replaces manual ticketing methods with a robust digital workflow. It manages the entire lifecycle of a reservation from student identity validation via campus email to final entry verification at the event gate using QR technology. The goal is to eliminate ticket fraud and provide a seamless experience for both organizers and attendees.

---

## 🆕 Core Features & Functionalities

### 🔐 Secure Identity Validation
- 📧 **Campus Email Authentication:** Integrated **EmailJS** for OTP-based registration, restricting access only to official `@sltc.edu.lk` accounts.
- 🛡️ **Anti-Fraud Logic:** Custom-built algorithm to prevent duplicate Ticket ID generation and unauthorized duplication.

### 💸 Automated Payment Workflow
- 📂 **Digital Slip Upload:** A dedicated portal for students to upload bank transfer receipts directly to **Firebase Cloud Storage**.
- ⚖️ **Admin Verification Center:** A real-time dashboard for the committee to review, approve or reject payment proofs instantly.

### 📊 Real-Time Operations
- ⚡ **Live Synchronization:** Powered by **Firebase Firestore**, ensuring data consistency across all administrative devices.
- 📲 **QR Attendance Scanner:** A specialized verification interface to scan tickets at the gate and prevent "double-entry" fraud by marking attendees in real-time.

---

## 🕰️ Project Evolution & Milestones

### 🚀 Phase 2: Live Deployment & Automation (Current)
- 🌐 **Full-Stack Integration:** Migrated from basic forms to a complete React-Firebase architecture.
- 🎫 **Digital Ticketing:** Automated PDF/Image ticket generation with unique security IDs.
- 🔍 **Verification Logic:** Implemented a secure QR-scanning portal to prevent duplicate entries and ensure event integrity.

### 🛠️ Phase 1: Prototype & Core Logic
- 📋 **Form Design:** Developed initial registration workflows and identity validation logic.
- 🧪 **System Testing:** Conducted stress tests for high-volume data entry and Firebase performance.

---

## 🛠️ Technology Stack

- ✅ **Frontend:** React.js (Vite), TypeScript, Tailwind CSS
- ✅ **Animations:** Framer Motion (for a premium UI/UX experience)
- ✅ **BaaS (Backend):** Firebase Firestore, Cloud Storage, Hosting
- ✅ **Integrations:** EmailJS API for secure transactional messaging

---

## 🔒 Security & Best Practices

To maintain system integrity, all sensitive API keys and Firebase configuration parameters are managed via environment variables (`.env`). These files are strictly excluded from version control to prevent unauthorized access to the production database.

---

## 👨‍💻 Developed By
**Methum Mandinu**
Software Engineering Student @SLTC | Front-End Developer

> 📌 *This project was developed to provide a secure and efficient digital solution for the **Mathaka Handiya** event management at SLTC.*
