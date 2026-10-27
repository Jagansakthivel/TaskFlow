import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Task from '../models/Task.js';

const DATA_FILE = path.resolve(process.cwd(), 'server', 'data', 'tasks.json');

export const INITIAL_SEED_TASKS = [
  // To Do (3)
  {
    _id: 'task-todo-1',
    title: 'Copywriting Review',
    project: 'Google Dashboard',
    description: 'Audit and refine hero headlines, onboarding microcopy, and empty state messaging across the Google Dashboard workspace.',
    priority: 'Medium',
    status: 'todo',
    dueDate: '2026-01-24T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    _id: 'task-todo-2',
    title: 'UX Audit',
    project: 'Grab Map App',
    description: 'Evaluate pin clustering density, live driver telemetry feedback, and one-handed thumb navigation flows.',
    priority: 'Medium',
    status: 'todo',
    dueDate: '2026-01-25T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-06T10:15:00.000Z',
    updatedAt: '2026-01-06T10:15:00.000Z',
  },
  {
    _id: 'task-todo-3',
    title: 'Sprint Planning',
    project: 'Dribbble',
    description: 'Prioritize Q1 creator portfolio showcase cards, shot upload compression, and search filter taxonomy.',
    priority: 'Medium',
    status: 'todo',
    dueDate: '2026-01-30T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-07T11:30:00.000Z',
    updatedAt: '2026-01-07T11:30:00.000Z',
  },

  // In Progress (3)
  {
    _id: 'task-prog-1',
    title: 'Wireframe v2 Upload',
    project: 'Netflix',
    description: 'Upload revised low-latency episode switcher wireframes and interactive preview hover states.',
    priority: 'Low',
    status: 'in-progress',
    dueDate: '2026-01-17T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-08T14:00:00.000Z',
    updatedAt: '2026-01-14T16:20:00.000Z',
  },
  {
    _id: 'task-prog-2',
    title: 'QA Testing',
    project: 'Nvidia',
    description: 'Run cross-browser WebGL viewport regression suite and verify frame-time telemetry charts under load.',
    priority: 'Low',
    status: 'in-progress',
    dueDate: '2026-01-17T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-09T08:45:00.000Z',
    updatedAt: '2026-01-15T09:10:00.000Z',
  },
  {
    _id: 'task-prog-3',
    title: 'Prototype Review',
    project: 'Behance',
    description: 'Conduct stakeholder walkthrough of interactive case study builder and masonry grid responsiveness.',
    priority: 'Medium',
    status: 'in-progress',
    dueDate: '2026-01-18T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-10T13:20:00.000Z',
    updatedAt: '2026-01-15T11:45:00.000Z',
  },

  // Completed (5)
  {
    _id: 'task-comp-1',
    title: 'Design System Audit',
    project: 'Amazon Dashboard',
    description: 'Standardize spacing tokens, button elevation states, and accessible contrast ratios across seller analytics.',
    priority: 'High',
    status: 'completed',
    dueDate: '2026-01-10T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-02T09:00:00.000Z',
    updatedAt: '2026-01-10T17:00:00.000Z',
  },
  {
    _id: 'task-comp-2',
    title: 'Landing Page Copywriting',
    project: 'Microsoft',
    description: 'Finalize enterprise cloud security value propositions, customer proof metrics, and CTA hierarchy.',
    priority: 'High',
    status: 'completed',
    dueDate: '2026-01-12T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-03T10:30:00.000Z',
    updatedAt: '2026-01-12T15:40:00.000Z',
  },
  {
    _id: 'task-comp-3',
    title: 'Mobile App Redesign',
    project: 'Apple',
    description: 'Deliver high-craft iOS spatial audio controller modals and adaptive dark mode surface tokens.',
    priority: 'High',
    status: 'completed',
    dueDate: '2026-01-14T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-04T11:00:00.000Z',
    updatedAt: '2026-01-14T18:00:00.000Z',
  },
  {
    _id: 'task-comp-4',
    title: 'Review Landing Page',
    project: 'Lego',
    description: 'Verify interactive 3D brick builder onboarding tutorial and family account checkout accessibility.',
    priority: 'Medium',
    status: 'completed',
    dueDate: '2026-01-04T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-01T09:30:00.000Z',
    updatedAt: '2026-01-04T16:15:00.000Z',
  },
  {
    _id: 'task-comp-5',
    title: 'Component Token Sync',
    project: 'Figma',
    description: 'Publish updated CSS custom property tokens from Figma Variables directly to the frontend repository.',
    priority: 'Low',
    status: 'completed',
    dueDate: '2026-01-08T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-02T14:20:00.000Z',
    updatedAt: '2026-01-08T17:30:00.000Z',
  },

  // Overdue (3)
  {
    _id: 'task-over-1',
    title: '16 Jan 2026',
    project: 'Facebook Dashboard',
    description: 'Complete scheduled mid-January attribution reporting migration and campaign conversion pixel verification.',
    priority: 'Low',
    status: 'overdue',
    dueDate: '2026-01-10T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-02T08:00:00.000Z',
    updatedAt: '2026-01-10T12:00:00.000Z',
  },
  {
    _id: 'task-over-2',
    title: 'API Rate Limit Telemetry',
    project: 'Amazon Dashboard',
    description: 'Configure real-time threshold alerts and fallback queue retries for high-concurrency webhook endpoints.',
    priority: 'High',
    status: 'overdue',
    dueDate: '2026-01-09T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-02T11:00:00.000Z',
    updatedAt: '2026-01-09T12:00:00.000Z',
  },
  {
    _id: 'task-over-3',
    title: 'Accessibility Contrast Pass',
    project: 'Google Dashboard',
    description: 'Resolve WCAG AA focus ring visibility and keyboard trap edge cases in nested filter popovers.',
    priority: 'Medium',
    status: 'overdue',
    dueDate: '2026-01-11T12:00:00.000Z',
    isSeed: true,
    createdAt: '2026-01-03T15:00:00.000Z',
    updatedAt: '2026-01-11T12:00:00.000Z',
  },
];

// Normalize overdue status dynamically based on dueDate < referenceNow && status !== 'completed'
export function evaluateTaskStatus(task) {
  const normalized = { ...task };
  if (normalized.status === 'completed') {
    return normalized;
  }
  if (normalized.status === 'overdue') {
    return normalized;
  }
  const referenceNow = normalized.isSeed
    ? new Date('2026-01-16T12:00:00.000Z')
    : new Date();
  referenceNow.setHours(0, 0, 0, 0);

  const due = new Date(normalized.dueDate);
  due.setHours(0, 0, 0, 0);

  if (due < referenceNow) {
    normalized.status = 'overdue';
  }
  return normalized;
}

function readLocalTasks() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(evaluateTaskStatus);
      }
    }
  } catch (err) {
    console.error('Error reading local tasks file:', err);
  }
  const seeded = INITIAL_SEED_TASKS.map(evaluateTaskStatus);
  writeLocalTasks(seeded);
  return seeded;
}

function writeLocalTasks(tasks) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local tasks file:', err);
  }
}

const isMongoConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all tasks with optional search & multi-criteria filtering
// @route   GET /api/v1/tasks
export const getTasks = async (req, res) => {
  try {
    const { search, project, status, priority, timeRange } = req.query;

    let tasks = [];
    if (isMongoConnected()) {
      const count = await Task.countDocuments();
      if (count === 0) {
        await Task.insertMany(INITIAL_SEED_TASKS.map(({ _id, ...rest }) => rest));
      }
      const docs = await Task.find().sort({ createdAt: -1 }).lean();
      tasks = docs.map((d) => evaluateTaskStatus({ ...d, _id: String(d._id) }));
    } else {
      tasks = readLocalTasks();
    }

    // Apply multi-criteria filters if provided in query params
    if (search && String(search).trim() !== '') {
      const q = String(search).toLowerCase().trim();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    if (project && project !== 'All') {
      tasks = tasks.filter((t) => t.project === project);
    }

    if (status && status !== 'All') {
      tasks = tasks.filter((t) => t.status === status);
    }

    if (priority && priority !== 'All') {
      tasks = tasks.filter((t) => t.priority === priority);
    }

    if (timeRange && timeRange !== 'All') {
      tasks = tasks.filter((t) => {
        const due = new Date(t.dueDate);
        if (timeRange === 'Overdue') return t.status === 'overdue';
        if (timeRange === 'JanFirstHalf') return due.getDate() <= 16;
        if (timeRange === 'JanSecondHalf') return due.getDate() > 16;
        return true;
      });
    }

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('getTasks error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks',
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics using MongoDB $facet aggregation pipeline
// @route   GET /api/v1/tasks/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const [result] = await Task.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            completed: [
              { $match: { status: 'completed' } },
              { $count: 'count' },
            ],
            overdue: [
              {
                $match: {
                  status: { $ne: 'completed' },
                  $or: [
                    { status: 'overdue' },
                    { isSeed: false, dueDate: { $lt: now } },
                  ],
                },
              },
              { $count: 'count' },
            ],
            toDo: [
              {
                $match: {
                  status: 'todo',
                  $or: [{ isSeed: true }, { dueDate: { $gte: now } }],
                },
              },
              { $count: 'count' },
            ],
            inProgress: [
              {
                $match: {
                  status: 'in-progress',
                  $or: [{ isSeed: true }, { dueDate: { $gte: now } }],
                },
              },
              { $count: 'count' },
            ],
          },
        },
      ]);

      const stats = {
        total: result?.total?.[0]?.count || 0,
        toDo: result?.toDo?.[0]?.count || 0,
        inProgress: result?.inProgress?.[0]?.count || 0,
        completed: result?.completed?.[0]?.count || 0,
        overdue: result?.overdue?.[0]?.count || 0,
      };

      return res.status(200).json({
        success: true,
        data: stats,
      });
    }

    // Fallback aggregation on persistent local task collection
    const tasks = readLocalTasks();
    const stats = tasks.reduce(
      (acc, task) => {
        acc.total += 1;
        if (task.status === 'completed') acc.completed += 1;
        else if (task.status === 'overdue') acc.overdue += 1;
        else if (task.status === 'in-progress') acc.inProgress += 1;
        else acc.toDo += 1;
        return acc;
      },
      { total: 0, toDo: 0, inProgress: 0, completed: 0, overdue: 0 }
    );

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to aggregate dashboard statistics',
      error: error.message,
    });
  }
};

// @desc    Create a new task
// @route   POST /api/v1/tasks
export const createTask = async (req, res) => {
  try {
    const { title, project, description, priority, status, dueDate } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const rawTask = {
      title: String(title).trim(),
      project: project ? String(project).trim() : 'Google Dashboard',
      description: description ? String(description).trim() : '',
      priority: ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium',
      status: ['todo', 'in-progress', 'completed', 'overdue'].includes(status)
        ? status
        : 'todo',
      dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
      isSeed: false,
    };

    const evaluated = evaluateTaskStatus(rawTask);

    if (isMongoConnected()) {
      const created = await Task.create(evaluated);
      return res.status(201).json({
        success: true,
        data: evaluateTaskStatus(created.toObject()),
      });
    }

    const tasks = readLocalTasks();
    const newTask = {
      _id: req.body._id || `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...evaluated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedTasks = [newTask, ...tasks];
    writeLocalTasks(updatedTasks);

    return res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    console.error('createTask error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message,
    });
  }
};

// @desc    Update an existing task
// @route   PUT /api/v1/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };

    // If the user explicitly changed dueDate, evaluate overdue relative to real current time unless they explicitly set status
    if (updates.dueDate && !updates.preserveSeedClock) {
      updates.isSeed = false;
    }

    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Task.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: evaluateTaskStatus({ ...updated, _id: String(updated._id) }),
      });
    }

    const tasks = readLocalTasks();
    const index = tasks.findIndex((t) => String(t._id) === String(id));
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const merged = {
      ...tasks[index],
      ...updates,
    };

    // If user explicitly drags/moves a task to 'todo' or 'in-progress', ensure it stays in that column
    if (
      updates.status &&
      (updates.status === 'todo' || updates.status === 'in-progress') &&
      !updates.dueDate
    ) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const currentDue = new Date(merged.dueDate);
      if (currentDue < now && !merged.isSeed) {
        // Bump dueDate to tomorrow if moving out of overdue without specifying a new date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        merged.dueDate = tomorrow.toISOString();
      } else if (merged.isSeed && new Date(merged.dueDate) < new Date('2026-01-16T12:00:00.000Z')) {
        merged.dueDate = '2026-01-24T12:00:00.000Z';
      }
      tasks[index] = merged;
    } else {
      tasks[index] = evaluateTaskStatus(merged);
    }

    writeLocalTasks(tasks);

    return res.status(200).json({
      success: true,
      data: tasks[index],
    });
  } catch (error) {
    console.error('updateTask error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message,
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Task.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: { _id: id },
      });
    }

    const tasks = readLocalTasks();
    const filtered = tasks.filter((t) => String(t._id) !== String(id));
    writeLocalTasks(filtered);

    return res.status(200).json({
      success: true,
      data: { _id: id },
    });
  } catch (error) {
    console.error('deleteTask error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message,
    });
  }
};

// @desc    Reset tasks to initial reference design state
// @route   POST /api/v1/tasks/reset
export const resetTasks = async (req, res) => {
  try {
    const seeded = INITIAL_SEED_TASKS.map(evaluateTaskStatus);
    if (isMongoConnected()) {
      await Task.deleteMany({});
      await Task.insertMany(seeded.map(({ _id, ...rest }) => rest));
    }
    writeLocalTasks(seeded);
    return res.status(200).json({
      success: true,
      data: seeded,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to reset tasks',
      error: error.message,
    });
  }
};
