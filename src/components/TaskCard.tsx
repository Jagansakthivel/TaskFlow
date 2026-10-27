import React, { useState } from 'react';
import { MoreHorizontal, Edit3, Trash2, ArrowRightCircle } from 'lucide-react';
import { TaskItem, TaskStatus, useTasks } from '../context/TaskContext';
import { ProjectIcon } from './ProjectIcon';

interface TaskCardProps {
  task: TaskItem;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}

export function formatCardDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;
    const day = String(date.getUTCDate()).padStart(2, '0');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return isoDate;
  }
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart }) => {
  const { openEditModal, deleteTask, moveTaskStatus } = useTasks();
  const [menuOpen, setMenuOpen] = useState(false);

  const priorityStyles: Record<TaskItem['priority'], string> = {
    Low: 'border-[#3B82F6] text-[#3B82F6] dark:border-blue-400 dark:text-blue-400 bg-white dark:bg-slate-800',
    Medium:
      'border-[#F59E0B] text-[#D97706] dark:border-amber-400 dark:text-amber-400 bg-white dark:bg-slate-800',
    High: 'border-[#EF4444] text-[#DC2626] dark:border-rose-400 dark:text-rose-400 bg-white dark:bg-slate-800',
  };

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
  ];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      onClick={() => openEditModal(task)}
      className="group relative bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700/90 rounded-[14px] p-4 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs transition-all duration-150 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Header Row: Project Icon + Project Name + ••• Menu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <ProjectIcon project={task.project} className="w-4 h-4 shrink-0" />
          <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 truncate">
            {task.project}
          </span>
        </div>

        <div
          className="relative shrink-0"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Task options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-7 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1.5 z-40 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openEditModal(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Task Details</span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Move Column
                </div>
                {statusOptions
                  .filter((s) => s.value !== task.status)
                  .map((st) => (
                    <button
                      key={st.value}
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        moveTaskStatus(task._id, st.value);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                    >
                      <ArrowRightCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{st.label}</span>
                    </button>
                  ))}

                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    deleteTask(task._id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/30 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body: Bold Task Title */}
      <h3 className="mt-3 mb-4 text-[15px] font-semibold text-slate-900 dark:text-white leading-snug tracking-[-0.01em] break-words">
        {task.title}
      </h3>

      {/* Footer Row: Due Date on Left + Outlined Priority Pill on Right */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <span
          className={`text-[11.5px] font-medium tabular-nums whitespace-nowrap ${
            task.status === 'overdue'
              ? 'text-slate-600 dark:text-rose-300'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {formatCardDate(task.dueDate)}
        </span>

        <span
          className={`inline-flex items-center justify-center px-3.5 py-1 rounded-full border text-[11.5px] font-medium leading-none whitespace-nowrap ${
            priorityStyles[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );
};
