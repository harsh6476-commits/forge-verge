# FORGE OS — Build Your Engineering Future

A focused, personal 18-month engineering learning roadmap and daily execution system.

---

## Architecture & Vision

FORGE OS is streamlined into **two core views**:

1. **TODAY (`/`)**: Daily command view with two panels:
   - **Left**: Today's topics checklist with categories, completion status, duration, and progress percentage.
   - **Right**: Selected topic inspector with "What You Will Learn", subtopics checklist, practical tasks, expected outcomes, auto-saving personal study notes, and file/screenshot attachments.
2. **MILESTONES (`/milestones`)**: A winding vertical progression path inspired by Candy Crush covering 17 outcome-based milestones across all 6 phases of the 18-month curriculum. Shows acceptance criteria, target dates, journey days, and attached projects.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose).
- **Storage**: Cloudinary (with adaptive client-side WebP compression targeting 300–500 KB).
- **Access Gate**: Private PIN authentication with 1-hour session expiration via secure HttpOnly cookie.

---

## Getting Started

### 1. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your credentials in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/forge_os?retryWrites=true&w=majority
APP_ACCESS_PIN=1234
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_ORIGIN=http://localhost:5173
```

### 2. Run Locally
Run both client and server concurrently:
```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173). Enter your PIN (default `1234`) to unlock the workspace.

### 3. Build & Test
```bash
npm run build    # Strict TypeScript check & Vite production build
npm test         # Run Vitest test suite
npm run lint     # Run Oxlint
```
