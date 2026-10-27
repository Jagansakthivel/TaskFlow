import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
  resetTasks,
} from '../controllers/taskController.js';

const router = express.Router();

// Dashboard statistics aggregation route
router.get('/dashboard/stats', getDashboardStats);

// Reset demo tasks to initial reference design state
router.post('/reset', resetTasks);

// Standard REST CRUD routes
router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).patch(updateTask).delete(deleteTask);

export default router;
