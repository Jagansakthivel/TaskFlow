import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'overdue';

export interface TaskItem {
  _id: string;
  title: string;
  project: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  isSeed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  total: number;
  toDo: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface ActivityEvent {
  id: string;
  action: string;
  taskTitle: string;
  project: string;
  timestamp: string;
  actor: string;
}

export interface TaskFilters {
  search: string;
  project: string;
  timeRange: string;
  status: string;
  priority: string;
}

interface TaskContextValue {
  tasks: TaskItem[];
  filteredTasks: TaskItem[];
  stats: DashboardStats;
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  resetFilters: () => void;
  viewMode: 'kanban' | 'list';
  setViewMode: (mode: 'kanban' | 'list') => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  isSyncing: boolean;
  modalState: {
    isOpen: boolean;
    mode: 'create' | 'edit';
    defaultStatus?: TaskStatus;
    task?: TaskItem | null;
  };
  openCreateModal: (defaultStatus?: TaskStatus) => void;
  openEditModal: (task: TaskItem) => void;
  closeModal: () => void;
  createTask: (payload: Omit<TaskItem, '_id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<TaskItem>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => Promise<void>;
  resetWorkspaceData: () => Promise<void>;
  activities: ActivityEvent[];
  availableProjects: string[];
  currentUser: {
    name: string;
    role: string;
  };
  setCurrentUser: React.Dispatch<React.SetStateAction<{ name: string; role: string }>>;
}

const STORAGE_KEY = 'taskflow_tasks_cache_v1';
const THEME_KEY = 'taskflow_theme_v1';
const ACTIVITY_KEY = 'taskflow_activity_v1';

export const DEFAULT_SEED_TASKS: TaskItem[] = [
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
  },
];

export function normalizeTaskOverdue(task: TaskItem): TaskItem {
  if (task.status === 'completed' || task.status === 'overdue') {
    return task;
  }
  const referenceNow = task.isSeed
    ? new Date('2026-01-16T12:00:00.000Z')
    : new Date();
  referenceNow.setHours(0, 0, 0, 0);

  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);

  if (due < referenceNow) {
    return { ...task, status: 'overdue' };
  }
  return task;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeTaskOverdue);
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage task cache:', e);
    }
    return DEFAULT_SEED_TASKS.map(normalizeTaskOverdue);
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    try {
      const saved = localStorage.getItem(ACTIVITY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'act-1',
        action: 'Completed task',
        taskTitle: 'Mobile App Redesign',
        project: 'Apple',
        timestamp: '14 Jan 2026, 18:00',
        actor: 'Reyhan Adinata',
      },
      {
        id: 'act-2',
        action: 'Moved to In Progress',
        taskTitle: 'Prototype Review',
        project: 'Behance',
        timestamp: '15 Jan 2026, 11:45',
        actor: 'Alex Morgan',
      },
      {
        id: 'act-3',
        action: 'Flagged as Overdue',
        taskTitle: '16 Jan 2026',
        project: 'Facebook Dashboard',
        timestamp: '16 Jan 2026, 09:00',
        actor: 'TaskFlow Rule Engine',
      },
    ];
  });

  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    project: 'All',
    timeRange: 'All',
    status: 'All',
    priority: 'All',
  });

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [activeNav, setActiveNav] = useState<string>('my-tasks');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string }>({
    name: 'Reyhan Adinata',
    role: 'Lead Product',
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    defaultStatus?: TaskStatus;
    task?: TaskItem | null;
  }>({
    isOpen: false,
    mode: 'create',
    defaultStatus: 'todo',
    task: null,
  });

  // Apply dark mode class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Persist tasks to localStorage immediately on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to write tasks to localStorage:', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities.slice(0, 30)));
    } catch {
      // ignore
    }
  }, [activities]);

  const logActivity = useCallback(
    (action: string, taskTitle: string, project: string) => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      setActivities((prev) => [
        {
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          action,
          taskTitle,
          project,
          timestamp: `${formatted}, ${now.toTimeString().slice(0, 5)}`,
          actor: currentUser.name,
        },
        ...prev,
      ]);
    },
    [currentUser.name]
  );

  // Synchronize with Express Backend on mount
  useEffect(() => {
    let mounted = true;
    async function syncFromBackend() {
      setIsSyncing(true);
      try {
        const res = await fetch('/api/v1/tasks');
        if (res.ok) {
          const json = await res.json();
          if (mounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
            setTasks(json.data.map(normalizeTaskOverdue));
          }
        }
      } catch {
        // Offline resilience: localStorage cache is already active
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsSyncing(false);
        }
      }
    }
    syncFromBackend();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      project: 'All',
      timeRange: 'All',
      status: 'All',
      priority: 'All',
    });
  }, []);

  const openCreateModal = useCallback((defaultStatus: TaskStatus = 'todo') => {
    setModalState({
      isOpen: true,
      mode: 'create',
      defaultStatus,
      task: null,
    });
  }, []);

  const openEditModal = useCallback((task: TaskItem) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      defaultStatus: task.status,
      task,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false, task: null }));
  }, []);

  const createTask = useCallback(
    async (payload: Omit<TaskItem, '_id'>) => {
      const tempId = `task-${Date.now()}`;
      const optimisticTask = normalizeTaskOverdue({
        ...payload,
        _id: tempId,
        isSeed: false,
        createdAt: new Date().toISOString(),
      });

      setTasks((prev) => [optimisticTask, ...prev]);
      logActivity('Created task', optimisticTask.title, optimisticTask.project);

      setIsSyncing(true);
      try {
        const res = await fetch('/api/v1/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...optimisticTask }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setTasks((prev) =>
              prev.map((t) => (t._id === tempId ? normalizeTaskOverdue(json.data) : t))
            );
          }
        }
      } catch {
        // Remains saved in localStorage
      } finally {
        setIsSyncing(false);
      }
    },
    [logActivity]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<TaskItem>) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t._id !== id) return t;
          const merged: TaskItem = {
            ...t,
            ...updates,
            isSeed: updates.dueDate ? false : t.isSeed,
          };
          return normalizeTaskOverdue(merged);
        })
      );

      const target = tasks.find((t) => t._id === id);
      if (target) {
        logActivity(
          `Updated task`,
          updates.title || target.title,
          updates.project || target.project
        );
      }

      setIsSyncing(true);
      try {
        const res = await fetch(`/api/v1/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setTasks((prev) =>
              prev.map((t) => (t._id === id ? normalizeTaskOverdue(json.data) : t))
            );
          }
        }
      } catch {
        // Optimistic update already applied in localStorage
      } finally {
        setIsSyncing(false);
      }
    },
    [tasks, logActivity]
  );

  const moveTaskStatus = useCallback(
    async (id: string, newStatus: TaskStatus) => {
      const existing = tasks.find((t) => t._id === id);
      if (!existing || existing.status === newStatus) return;

      let adjustedDueDate = existing.dueDate;
      if (newStatus === 'todo' || newStatus === 'in-progress') {
        const due = new Date(existing.dueDate);
        const refNow = existing.isSeed
          ? new Date('2026-01-16T12:00:00.000Z')
          : new Date();
        refNow.setHours(0, 0, 0, 0);
        if (due < refNow) {
          if (existing.isSeed) {
            adjustedDueDate = '2026-01-24T12:00:00.000Z';
          } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 2);
            adjustedDueDate = tomorrow.toISOString();
          }
        }
      }

      setTasks((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, status: newStatus, dueDate: adjustedDueDate } : t
        )
      );

      const statusLabels: Record<TaskStatus, string> = {
        todo: 'To Do',
        'in-progress': 'In Progress',
        completed: 'Completed',
        overdue: 'Overdue',
      };
      logActivity(
        `Moved to ${statusLabels[newStatus]}`,
        existing.title,
        existing.project
      );

      setIsSyncing(true);
      try {
        await fetch(`/api/v1/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: newStatus,
            dueDate: adjustedDueDate,
            preserveSeedClock: true,
          }),
        });
      } catch {
        // Cached locally
      } finally {
        setIsSyncing(false);
      }
    },
    [tasks, logActivity]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const target = tasks.find((t) => t._id === id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (target) {
        logActivity('Deleted task', target.title, target.project);
      }

      setIsSyncing(true);
      try {
        await fetch(`/api/v1/tasks/${id}`, {
          method: 'DELETE',
        });
      } catch {
        // Cached locally
      } finally {
        setIsSyncing(false);
      }
    },
    [tasks, logActivity]
  );

  const resetWorkspaceData = useCallback(async () => {
    const fresh = DEFAULT_SEED_TASKS.map(normalizeTaskOverdue);
    setTasks(fresh);
    resetFilters();
    logActivity('Reset workspace to reference tasks', 'All Board Columns', 'TaskFlow');
    try {
      await fetch('/api/v1/tasks/reset', { method: 'POST' });
    } catch {
      // Cached locally
    }
  }, [resetFilters, logActivity]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.search.trim() !== '') {
        const q = filters.search.toLowerCase().trim();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchProject = task.project.toLowerCase().includes(q);
        const matchDesc = task.description?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchProject && !matchDesc) return false;
      }

      if (filters.project !== 'All' && task.project !== filters.project) {
        return false;
      }

      if (filters.status !== 'All' && task.status !== filters.status) {
        return false;
      }

      if (filters.priority !== 'All' && task.priority !== filters.priority) {
        return false;
      }

      if (filters.timeRange !== 'All') {
        const due = new Date(task.dueDate);
        const day = due.getUTCDate();
        const month = due.getUTCMonth();
        if (filters.timeRange === 'Jan 1 - Jan 15') {
          if (month !== 0 || day > 15) return false;
        } else if (filters.timeRange === 'Jan 16 - Jan 31') {
          if (month !== 0 || day < 16) return false;
        } else if (filters.timeRange === 'Overdue Only') {
          if (task.status !== 'overdue') return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  const stats: DashboardStats = useMemo(() => {
    return filteredTasks.reduce(
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
  }, [filteredTasks]);

  const availableProjects = useMemo(() => {
    const set = new Set<string>([
      'Google Dashboard',
      'Grab Map App',
      'Dribbble',
      'Netflix',
      'Nvidia',
      'Behance',
      'Amazon Dashboard',
      'Microsoft',
      'Apple',
      'Lego',
      'Facebook Dashboard',
      'Figma',
    ]);
    tasks.forEach((t) => {
      if (t.project) set.add(t.project);
    });
    return Array.from(set);
  }, [tasks]);

  const value: TaskContextValue = {
    tasks,
    filteredTasks,
    stats,
    filters,
    setFilters,
    resetFilters,
    viewMode,
    setViewMode,
    activeNav,
    setActiveNav,
    theme,
    toggleTheme,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isLoading,
    isSyncing,
    modalState,
    openCreateModal,
    openEditModal,
    closeModal,
    createTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
    resetWorkspaceData,
    activities,
    availableProjects,
    currentUser,
    setCurrentUser,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextValue => {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return ctx;
};
