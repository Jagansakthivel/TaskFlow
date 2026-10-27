import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import {
  TaskPriority,
  TaskStatus,
  useTasks,
} from '../context/TaskContext';
import { PROJECT_LIST, ProjectIcon } from './ProjectIcon';

export const TaskModal: React.FC = () => {
  const {
    modalState,
    closeModal,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const { isOpen, mode, defaultStatus, task } = modalState;

  const [title, setTitle] = useState('');
  const [project, setProject] = useState('Google Dashboard');
  const [customProject, setCustomProject] = useState('');
  const [isCustomProject, setIsCustomProject] = useState(false);
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState('2026-01-24');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (mode === 'edit' && task) {
      setTitle(task.title);
      if (PROJECT_LIST.includes(task.project)) {
        setProject(task.project);
        setIsCustomProject(false);
      } else {
        setIsCustomProject(true);
        setCustomProject(task.project);
      }
      setPriority(task.priority);
      setStatus(task.status);
      const iso = new Date(task.dueDate);
      if (!isNaN(iso.getTime())) {
        setDueDate(iso.toISOString().split('T')[0]);
      } else {
        setDueDate('2026-01-24');
      }
      setDescription(task.description || '');
    } else {
      setTitle('');
      setProject('Google Dashboard');
      setCustomProject('');
      setIsCustomProject(false);
      setPriority('Medium');
      setStatus(defaultStatus || 'todo');
      // Default future date so new To Do / In Progress tasks don't immediately trip past-date unless chosen
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      setDueDate(defaultDate.toISOString().split('T')[0]);
      setDescription('');
    }
  }, [isOpen, mode, task, defaultStatus]);

  if (!isOpen) return null;

  // Check if chosen date is in the past and status !== 'completed'
  const isDateInPast = (() => {
    if (status === 'completed') return false;
    if (mode === 'edit' && task?.isSeed && dueDate === new Date(task.dueDate).toISOString().split('T')[0]) {
      return task.status === 'overdue';
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(`${dueDate}T12:00:00`);
    chosen.setHours(0, 0, 0, 0);
    return chosen < today;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    const finalProject = isCustomProject
      ? customProject.trim() || 'Google Dashboard'
      : project;

    const isoDue = new Date(`${dueDate}T12:00:00.000Z`).toISOString();

    if (mode === 'edit' && task) {
      await updateTask(task._id, {
        title: title.trim(),
        project: finalProject,
        priority,
        status,
        dueDate: isoDue,
        description: description.trim(),
      });
    } else {
      await createTask({
        title: title.trim(),
        project: finalProject,
        priority,
        status,
        dueDate: isoDue,
        description: description.trim(),
      });
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs transition-opacity"
        onClick={closeModal}
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-10">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {mode === 'edit' ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {mode === 'edit'
                ? 'Update task metadata, priority pill, or column status'
                : 'Add a new deliverable card to your TaskFlow board'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-600 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Copywriting Review, Design System Audit"
              autoFocus
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white dark:focus:bg-slate-800 transition-colors"
            />
          </div>

          {/* Project Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                Project / Brand
              </label>
              <button
                type="button"
                onClick={() => setIsCustomProject((prev) => !prev)}
                className="text-[11px] font-semibold text-[#2563EB] dark:text-blue-400 hover:underline"
              >
                {isCustomProject ? 'Choose Preset Project' : '+ Custom Project Name'}
              </button>
            </div>

            {isCustomProject ? (
              <input
                type="text"
                value={customProject}
                onChange={(e) => setCustomProject(e.target.value)}
                placeholder="Enter project or client name..."
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
              />
            ) : (
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none">
                  <ProjectIcon project={project} className="w-4 h-4" />
                </div>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  {PROJECT_LIST.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Priority Tag
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as TaskPriority[]).map((level) => {
                  const activeStyles: Record<TaskPriority, string> = {
                    Low: 'border-[#3B82F6] text-[#3B82F6] bg-blue-50/70 dark:bg-blue-950/50',
                    Medium:
                      'border-[#F59E0B] text-[#D97706] bg-amber-50/70 dark:bg-amber-950/50',
                    High: 'border-[#EF4444] text-[#DC2626] bg-rose-50/70 dark:bg-rose-950/50',
                  };
                  const isSelected = priority === level;

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className={`h-9 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? activeStyles[level]
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Board Column
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Deadline Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-sm text-slate-900 dark:text-white tabular-nums focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {isDateInPast && (
              <div className="mt-2 flex items-center gap-2 text-[11.5px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 px-3 py-1.5 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Deadline is in the past and task is not Completed — it will automatically move to the Overdue column.
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Notes & Acceptance Criteria
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add deliverable details, Figma links, or review checklist..."
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
            {mode === 'edit' && task ? (
              <button
                type="button"
                onClick={() => {
                  deleteTask(task._id);
                  closeModal();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {mode === 'edit' ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
