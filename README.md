# FORGE OS — Build Your Engineering Future

A focused, personal 18-month engineering learning roadmap and daily execution system.

---

## Architecture & Vision

FORGE OS is streamlined into **three core views**:

1. **TODAY (`/`)**: Daily command view with two panels:
   - **Left**: Today's topics checklist with categories, completion status, duration, and progress percentage.
   - **Right**: Selected topic inspector with "What You Will Learn", subtopics checklist, practical tasks, supporting practice (DSA recall), expected outcomes, auto-saving personal study notes, and file/screenshot attachments.
   - **Optimistic UI**: Instant 0ms perceived latency on topic/subtopic checkboxes.
   - **Live Streak & Notifications**: Consecutive habit tracking and browser push notifications for unfinished daily tasks.
2. **TOPICS (`/topics`)**: Comprehensive 547-item 18-month curriculum catalog:
   - **Full-Text & Regex Search**: Search across topics, practical tasks, and subtopics.
   - **Multi-Filter Controls**: Filter by Phase (1–6), Kind (Topic / Checkpoint / Review), Category, and Completion Status.
   - **Week Grouping View**: Toggle between responsive grid view and Phase/Week grouped view.
   - **Cursor Pagination**: Smooth cursor-based pagination (24 records per page).
   - **Detail Drawer**: Slide-out panel with subtopics checklist, practical tasks, supporting practice, research checkpoints, and linked projects with a 1-click "Open Scheduled Day" navigation.
3. **MILESTONES (`/milestones`)**: A winding vertical progression path inspired by Candy Crush covering 17 outcome-based milestones across all 6 phases:
   - **Automated Milestone Progression**: Status (`completed`, `current`, `upcoming`) and percentage are derived automatically from mapped topic completions (`completed / total * 100`). Manual completion override is disabled.
   - **Independent Scroll**: Right-hand inspector panel with independent scrolling for smooth reading of acceptance criteria, core technologies, and personal milestone notes.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, TanStack React Query (caching), Lucide React, Canvas Confetti.
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose).
- **Storage**: Cloudinary (with adaptive client-side WebP compression targeting 300–500 KB).
- **Access Gate**: Private PIN authentication with 1-hour session expiration via secure HttpOnly cookie (fails closed on database unavailability; no hardcoded defaults).

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

Visit [http://localhost:5173](http://localhost:5173). Enter your PIN to unlock the workspace.

### 3. Build & Test
```bash
npm run typecheck # Strict TypeScript check for both client and server
npm run build     # Full typecheck + Vite production build
npm test          # Run Vitest test suite (24 tests)
npm run lint      # Run Oxlint
```
