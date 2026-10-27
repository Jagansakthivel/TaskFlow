/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskModal } from './components/TaskModal';
import { ProjectIcon } from './components/ProjectIcon';
import { formatCardDate } from './components/TaskCard';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  ArrowRight,
  Calendar as CalendarIcon,
} from 'lucide-react';

const WorkspaceContent: React.FC = () => {
  const {
    activeNav,
    setActiveNav,
    stats,
    filteredTasks,
    activities,
    openEditModal,
    openCreateModal,
  } = useTasks();

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Left Collapsible Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 px-4 sm:px-8 max-w-[1600px] w-full mx-auto">
          <Toolbar />

          {activeNav === 'overview' && (
            <div className="space-y-6 pb-8">
              {/* 4 KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-[#F4F6FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      To Do Queue
                    </span>
                    <ListTodo className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                      {stats.toDo}
                    </span>
                    <span className="text-xs text-slate-500 tabular-nums">
                      of {stats.total} total
                    </span>
                  </div>
                </div>

                <div className="bg-[#F4F6FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      In Progress
                    </span>
                    <Clock className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-bold tabular-nums text-[#2563EB] dark:text-blue-400">
                      {stats.inProgress}
                    </span>
                    <span className="text-xs text-slate-500">Active sprint</span>
                  </div>
                </div>

                <div className="bg-[#F4F6FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Completed
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[#14857B]" />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-bold tabular-nums text-[#14857B] dark:text-teal-400">
                      {stats.completed}
                    </span>
                    <span className="text-xs font-semibold text-[#14857B] tabular-nums">
                      {completionRate}% done
                    </span>
                  </div>
                </div>

                <div className="bg-[#F4F6FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Overdue Tasks
                    </span>
                    <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-bold tabular-nums text-[#DC2626] dark:text-rose-400">
                      {stats.overdue}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveNav('my-tasks')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
                    >
                      <span>View Board</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Board Preview */}
              <KanbanBoard />
            </div>
          )}

          {activeNav === 'activity' && (
            <div className="pb-10">
              <div className="bg-[#F4F6FA] dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200/70 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Recent Workspace Activity
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Live audit log of task transitions, updates, and overdue triggers
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNav('my-tasks')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Back to My Tasks
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activities.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl p-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <ProjectIcon project={item.project} className="w-5 h-5 shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {item.action} · <span>{item.taskTitle}</span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {item.project} · by {item.actor}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-400 tabular-nums">
                        {item.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeNav === 'calendar' && (
            <div className="pb-10">
              <div className="bg-[#F4F6FA] dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200/70 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <CalendarIcon className="w-5 h-5 text-[#2563EB]" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Chronological Deadline Schedule
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCreateModal('todo')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    + Schedule Task
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {[...filteredTasks]
                    .sort(
                      (a, b) =>
                        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                    )
                    .map((task) => (
                      <div
                        key={task._id}
                        onClick={() => openEditModal(task)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-[#2563EB] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="inline-flex items-center gap-1.5 font-medium">
                            <ProjectIcon project={task.project} className="w-4 h-4" />
                            {task.project}
                          </span>
                          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                            {formatCardDate(task.dueDate)}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">
                          {task.title}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeNav === 'my-tasks' && <KanbanBoard />}
        </main>
      </div>

      {/* Create / Edit Task Modal */}
      <TaskModal />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <WorkspaceContent />
    </TaskProvider>
  );
}
