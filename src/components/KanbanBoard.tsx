import React, { useState } from 'react';
import {
  GripVertical,
  MoreHorizontal,
  Plus,
  ArrowUpDown,
  Trash2,
  Edit3,
  CheckCircle2,
} from 'lucide-react';
import { TaskItem, TaskStatus, useTasks } from '../context/TaskContext';
import { TaskCard, formatCardDate } from './TaskCard';
import { ProjectIcon } from './ProjectIcon';

interface ColumnConfig {
  id: TaskStatus;
  label: string;
  badgeBg: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'todo',
    label: 'To Do',
    badgeBg: 'bg-[#111827] dark:bg-slate-950 text-white',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    badgeBg: 'bg-[#2563EB] text-white',
  },
  {
    id: 'completed',
    label: 'Completed',
    badgeBg: 'bg-[#14857B] text-white',
  },
  {
    id: 'overdue',
    label: 'Overdue',
    badgeBg: 'bg-[#DC2626] text-white',
  },
];

export const KanbanBoard: React.FC = () => {
  const {
    filteredTasks,
    viewMode,
    openCreateModal,
    openEditModal,
    moveTaskStatus,
    deleteTask,
    resetFilters,
  } = useTasks();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const [columnSort, setColumnSort] = useState<
    Record<TaskStatus, 'default' | 'date' | 'priority'>
  >({
    todo: 'default',
    'in-progress': 'default',
    completed: 'default',
    overdue: 'default',
  });
  const [openColMenu, setOpenColMenu] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>, colId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (colId: TaskStatus) => {
    if (dragOverCol === colId) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDragOverCol(null);
    setDraggedTaskId(null);
    if (taskId) {
      moveTaskStatus(taskId, targetStatus);
    }
  };

  const getTasksForColumn = (colId: TaskStatus): TaskItem[] => {
    const colTasks = filteredTasks.filter((t) => t.status === colId);
    const sortMode = columnSort[colId];
    if (sortMode === 'date') {
      return [...colTasks].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    }
    if (sortMode === 'priority') {
      const rank: Record<TaskItem['priority'], number> = {
        High: 1,
        Medium: 2,
        Low: 3,
      };
      return [...colTasks].sort((a, b) => rank[a.priority] - rank[b.priority]);
    }
    return colTasks;
  };

  // List View Mode
  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900/60 text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-5">Task Title</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/70 text-[13.5px]">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      No matching tasks found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Adjust your active search or filter criteria, or create a new task.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 px-4 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const statusMeta: Record<
                    TaskStatus,
                    { label: string; badge: string }
                  > = {
                    todo: {
                      label: 'To Do',
                      badge: 'bg-[#111827] text-white',
                    },
                    'in-progress': {
                      label: 'In Progress',
                      badge: 'bg-[#2563EB] text-white',
                    },
                    completed: {
                      label: 'Completed',
                      badge: 'bg-[#14857B] text-white',
                    },
                    overdue: {
                      label: 'Overdue',
                      badge: 'bg-[#DC2626] text-white',
                    },
                  };

                  const priorityPill: Record<TaskItem['priority'], string> = {
                    Low: 'border-[#3B82F6] text-[#3B82F6] dark:border-blue-400 dark:text-blue-400',
                    Medium:
                      'border-[#F59E0B] text-[#D97706] dark:border-amber-400 dark:text-amber-400',
                    High: 'border-[#EF4444] text-[#DC2626] dark:border-rose-400 dark:text-rose-400',
                  };

                  return (
                    <tr
                      key={task._id}
                      onClick={() => openEditModal(task)}
                      className="hover:bg-slate-50/90 dark:hover:bg-slate-700/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-white">
                        {task.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                          <ProjectIcon project={task.project} className="w-4 h-4 shrink-0" />
                          <span>{task.project}</span>
                        </div>
                      </td>
                      <td
                        className="py-3.5 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={task.status}
                          onChange={(e) =>
                            moveTaskStatus(task._id, e.target.value as TaskStatus)
                          }
                          aria-label="Task status"
                          className={`px-2.5 py-1 rounded-md text-[11.5px] font-semibold cursor-pointer border-0 focus:outline-none ${
                            statusMeta[task.status].badge
                          }`}
                        >
                          <option value="todo" className="bg-white text-slate-900">
                            To Do
                          </option>
                          <option value="in-progress" className="bg-white text-slate-900">
                            In Progress
                          </option>
                          <option value="completed" className="bg-white text-slate-900">
                            Completed
                          </option>
                          <option value="overdue" className="bg-white text-slate-900">
                            Overdue
                          </option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                        {formatCardDate(task.dueDate)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-0.5 rounded-full border text-[11.5px] font-medium ${
                            priorityPill[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td
                        className="py-3.5 px-5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1">
                          {task.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => moveTaskStatus(task._id, 'completed')}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              title="Mark Completed"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditModal(task)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Edit Task"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTask(task._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Kanban 4-Column View matching the reference screenshot
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start pb-8">
      {COLUMNS.map((col) => {
        const colTasks = getTasksForColumn(col.id);
        const isOver = dragOverCol === col.id;

        return (
          <section
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={() => handleDragLeave(col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`bg-[#F4F6FA] dark:bg-slate-900/90 rounded-[18px] p-3.5 transition-all duration-150 ${
              isOver
                ? 'ring-2 ring-[#2563EB] bg-blue-50/50 dark:bg-blue-950/30'
                : 'border border-transparent dark:border-slate-800/80'
            }`}
          >
            {/* Column Header Row with Grip + Solid Colored Pill + Outlined Count Pill + ••• + + */}
            <div className="flex items-center justify-between gap-2 mb-3.5 px-0.5">
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 cursor-grab" />

                <span
                  className={`inline-flex items-center justify-center px-3 py-1 rounded-[7px] text-[12px] font-semibold leading-none whitespace-nowrap ${col.badgeBg}`}
                >
                  {col.label}
                </span>

                <span className="inline-flex items-center justify-center min-w-[24px] h-[22px] px-1.5 rounded-[7px] bg-white dark:bg-slate-800 border border-slate-400/70 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-[12px] font-semibold tabular-nums leading-none">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0 relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenColMenu((prev) => (prev === col.id ? null : col.id))
                  }
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Column options"
                  aria-label={`${col.label} column options`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => openCreateModal(col.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={`Add task to ${col.label}`}
                  aria-label={`Add task to ${col.label}`}
                >
                  <Plus className="w-4 h-4 stroke-[2.25]" />
                </button>

                {openColMenu === col.id && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setOpenColMenu(null)}
                    />
                    <div className="absolute right-0 top-8 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1.5 z-40 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setColumnSort((prev) => ({
                            ...prev,
                            [col.id]: prev[col.id] === 'date' ? 'default' : 'date',
                          }));
                          setOpenColMenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {columnSort[col.id] === 'date'
                            ? 'Default Order'
                            : 'Sort by Due Date'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setColumnSort((prev) => ({
                            ...prev,
                            [col.id]:
                              prev[col.id] === 'priority' ? 'default' : 'priority',
                          }));
                          setOpenColMenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {columnSort[col.id] === 'priority'
                            ? 'Default Order'
                            : 'Sort by Priority'}
                        </span>
                      </button>
                      <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                      <button
                        type="button"
                        onClick={() => {
                          setOpenColMenu(null);
                          openCreateModal(col.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[#2563EB] dark:text-blue-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/60"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Task Here</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Cards Stack with subtle custom scrollbar when > 4 cards (matching Completed column in screenshot) */}
            <div className="space-y-3 max-h-[590px] overflow-y-auto kanban-scroll pr-0.5">
              {colTasks.length === 0 ? (
                <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-[14px] p-6 text-center bg-white/50 dark:bg-slate-800/40">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    No tasks in {col.label}
                  </p>
                  <button
                    type="button"
                    onClick={() => openCreateModal(col.id)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add task</span>
                  </button>
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};
