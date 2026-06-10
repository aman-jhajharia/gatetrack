# GATE Preparation Management System (GPMS)

A full-stack web application for tracking GATE CSE exam preparation. Built with Next.js 15 + Express.js + MongoDB.

## 🏗️ Project Structure

```
gatetrack/
├── backend/          # Express.js + TypeScript API
└── frontend/         # Next.js 15 + TypeScript + TailwindCSS
```

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and JWT secrets
npm install
npm run seed          # Creates admin + 13 subjects
npm run dev           # Starts on port 5000
```


### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm install
npm run dev           # Starts on port 3000
```

## 🔐 Authentication

- No public signup. Admin creates all accounts.
- JWT-based authentication with 15-minute access tokens.
- Role-based access: Admin vs Student.

## 📚 Features

### Student Features
- **Dashboard**: GATE Readiness Score (gauge chart), subject progress overview
- **Subjects**: All 13 GATE CSE subjects with lecture + practice tracking
- **Lecture Tracker**: Mark watched (50%), notes (25%), short notes (25%)
- **Practice Tracker**: Track questions solved, times solved, confidence (1-5)
- **Revision Tracker**: 4-round revision system per unit
- **Mock Tests**: Log tests with score, accuracy, rank; analytics + trend chart
- **Vocabulary**: Mark words as known/needs revision/unknown

### Admin Features
- **Dashboard**: Platform stats overview
- **User Management**: Create/edit/delete student accounts
- **Subject Management**: Full nested CRUD — subjects → units → lectures
- **Vocabulary Management**: Add/edit/delete vocabulary words
- **Analytics**: Student roster and platform metrics

### GATE Readiness Score Formula
```
Score = Lecture% × 0.30 + Practice% × 0.40 + Revision% × 0.20 + MockAvg% × 0.10
```

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repo to Render
2. Set root directory to `backend/`
3. Build command: `npm install --production=false && npm run build`
4. Start command: `npm start`
5. Add all env variables from `.env.example`

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set root directory to `frontend/`
3. Add env variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`

## 🗃️ Database

MongoDB Atlas with 11 collections:
- Users, Subjects, Units, Lectures
- LectureProgress, PracticeUnits, QuestionProgress
- Revisions, MockTests, Vocabulary, VocabularyProgress

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, TailwindCSS |
| Charts | Recharts |
| Backend | Express.js, TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT |
| Deployment | Vercel + Render |
