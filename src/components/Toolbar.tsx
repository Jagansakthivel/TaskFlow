import React, { useState } from 'react';
import {
  Plus,
  ChevronDown,
  Calendar,
  Search,
  Columns3,
  AlignLeft,
  X,
} from 'lucide-react';
import { useTasks, TaskStatus } from '../context/TaskContext';

export const Toolbar: React.FC = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    viewMode,
    setViewMode,
    openCreateModal,
    availableProjects,
    activeNav,
  } = useTasks();

  const [quickTaskMenuOpen, setQuickTaskMenuOpen] = useState(false);

  const hasActiveFilters =
    filters.project !== 'All' ||
    filters.timeRange !== 'All' ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.search.trim() !== '';

  const pageTitle =
    activeNav === 'overview'
      ? 'Workspace Overview'
      : activeNav === 'activity'
      ? 'Activity Log'
      : activeNav === 'calendar'
      ? 'Release Calendar'
      : 'My Tasks';

  return (
    <div className="pt-6 pb-5 space-y-5">
      {/* Row 1: Page Title + Prominent Blue CTA Split Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 dark:text-white leading-none">
          {pageTitle}
        </h1>

        <div className="relative inline-flex">
          <div className="inline-flex items-center rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs overflow-hidden transition-colors">
            <button
              type="button"
              onClick={() => openCreateModal('todo')}
              className="flex items-center gap-2 px-4 h-10 sm:h-11 text-[13.5px] font-semibold whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Task</span>
            </button>
            <span className="w-px h-10 sm:h-11 bg-white/25" />
            <button
              type="button"
              onClick={() => setQuickTaskMenuOpen((prev) => !prev)}
              className="px-3 h-10 sm:h-11 flex items-center justify-center hover:bg-blue-800/40 transition-colors cursor-pointer"
              aria-label="Select initial status for new task"
            >
              <ChevronDown className="w-4 h-4 stroke-[2.25]" />
            </button>
          </div>

          {quickTaskMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setQuickTaskMenuOpen(false)}
              />
              <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1.5 z-40 text-xs">
                {(
                  [
                    { status: 'todo', label: 'Add to To Do', dot: 'bg-slate-900 dark:bg-slate-200' },
                    { status: 'in-progress', label: 'Add to In Progress', dot: 'bg-[#2563EB]' },
                    { status: 'completed', label: 'Add to Completed', dot: 'bg-[#14857B]' },
                    { status: 'overdue', label: 'Add to Overdue', dot: 'bg-[#DC2626]' },
                  ] as { status: TaskStatus; label: string; dot: string }[]
                ).map((item) => (
                  <button
                    key={item.status}
                    type="button"
                    onClick={() => {
                      setQuickTaskMenuOpen(false);
                      openCreateModal(item.status);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-medium"
                  >
                    <span className={`w-2 h-2 rounded-xs ${item.dot}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 2: View Switcher + Filter Dropdowns + Inline Search Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5">
        {/* Left: View Switcher (Kanban Board vs List View) */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 h-9 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`h-full px-3 rounded-[9px] flex items-center justify-center transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Kanban Board View"
              aria-label="Kanban Board View"
            >
              <Columns3 className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`h-full px-3 rounded-[9px] flex items-center justify-center transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List Table View"
              aria-label="List Table View"
            >
              <AlignLeft className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Right: Multi-Filter Dropdowns & Inline Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 1. All Project Dropdown */}
          <div className="relative">
            <select
              value={filters.project}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, project: e.target.value }))
              }
              aria-label="Filter by Project"
              className="appearance-none h-9 pl-4 pr-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer whitespace-nowrap"
            >
              <option value="All">All Project</option>
              {availableProjects.map((proj) => (
                <option key={proj} value={proj}>
                  {proj}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 2. All Time Dropdown */}
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.timeRange}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, timeRange: e.target.value }))
              }
              aria-label="Filter by Time Range"
              className="appearance-none h-9 pl-9 pr-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer whitespace-nowrap"
            >
              <option value="All">All Time</option>
              <option value="Jan 1 - Jan 15">Jan 1 – Jan 15</option>
              <option value="Jan 16 - Jan 31">Jan 16 – Jan 31</option>
              <option value="Overdue Only">Overdue Deadlines</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 3. All Status Dropdown */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              aria-label="Filter by Status"
              className="appearance-none h-9 pl-4 pr-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer whitespace-nowrap"
            >
              <option value="All">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 4. All Priority Dropdown */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priority: e.target.value }))
              }
              aria-label="Filter by Priority"
              className="appearance-none h-9 pl-4 pr-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer whitespace-nowrap"
            >
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* 5. Dedicated Inline Search Input */}
          <div className="relative flex-1 sm:flex-initial sm:w-[215px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Search task / project"
              className="w-full h-9 pl-9 pr-4 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12.5px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
