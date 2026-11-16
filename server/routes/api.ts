import express from 'express';
import { unlockAccess, checkSession, lockAccess } from '../controllers/accessController.js';
import {
  getTodayPlan,
  getPlanByDate,
  updateItemCompletion,
  updateSubtopicCompletion,
  updateItemNotes,
  getProgressSummary,
  getProgressHistory,
} from '../controllers/daysController.js';
import {
  getMilestones,
  updateMilestoneCompletion,
  updateMilestoneNotes,
} from '../controllers/milestonesController.js';
import {
  getCurriculumList,
  getCurriculumItemDetails,
} from '../controllers/curriculumController.js';
import {
  uploadMiddleware,
  uploadAttachment,
  deleteAttachment,
} from '../controllers/attachmentsController.js';
import {
  getNotifications,
  markNotificationAsRead,
} from '../controllers/notificationsController.js';
import { requireAccess } from '../controllers/accessController.js';

const router = express.Router();

// Access Gate (Public PIN unlock)
router.post('/access/unlock', unlockAccess);
router.get('/access/session', checkSession);
router.post('/access/lock', lockAccess);

// Protected routes (Protected by 1-hour PIN session cookie)
router.use(requireAccess);

// Daily Plans & History
router.get('/days/today', getTodayPlan);
router.get('/days', getPlanByDate);
router.get('/days/:date', getPlanByDate);
router.patch('/days/:date/items/:itemId/completion', updateItemCompletion);
router.patch('/days/:date/items/:itemId/subtopics/:subtopicId', updateSubtopicCompletion);
router.put('/days/:date/items/:itemId/notes', updateItemNotes);

// Progress & Streaks
router.get('/progress/summary', getProgressSummary);
router.get('/progress/history', getProgressHistory);

// Milestones Progression Path
router.get('/milestones', getMilestones);
router.patch('/milestones/:id/completion', updateMilestoneCompletion);
router.put('/milestones/:id/notes', updateMilestoneNotes);

// Topics / Full 18-Month Curriculum Catalog
router.get('/curriculum', getCurriculumList);
router.get('/curriculum/:itemId', getCurriculumItemDetails);

// Attachments
router.post('/attachments', uploadMiddleware, uploadAttachment);
router.delete('/attachments/:id', deleteAttachment);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationAsRead);

export default router;
