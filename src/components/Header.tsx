import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Menu,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const Header: React.FC = () => {
  const {
    filters,
    setFilters,
    openCreateModal,
    theme,
    toggleTheme,
    setIsMobileSidebarOpen,
    tasks,
    stats,
    resetWorkspaceData,
    currentUser,
    setCurrentUser,
    activities,
  } = useTasks();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadNotif, setUnreadNotif] = useState(true);

  // Global keyboard shortcut (Cmd+F or Ctrl+K) to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'f')) {
        // Only intercept Cmd+F if not inside an input already
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExportTasks = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'taskflow-tasks.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setCreateMenuOpen(false);
  };

  return (
    <header className="h-[72px] bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20 transition-colors">
      {/* Left: Mobile Menu Trigger + Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 max-w-[330px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search"
            className="w-full h-10 pl-10 pr-16 bg-[#F8FAFC] dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-xl text-[13.5px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          {filters.search ? (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          ) : (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-medium text-slate-400 dark:text-slate-500 pointer-events-none select-none tabular-nums">
              ⌘ + F
            </span>
          )}
        </div>
      </div>

      {/* Right: + Create New Split Button, Theme Switch, Help, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Outlined Split Button: + Create New | v */}
        <div className="relative hidden sm:inline-flex">
          <div className="inline-flex items-center rounded-xl border border-[#3B82F6] dark:border-blue-500 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => openCreateModal('todo')}
              className="flex items-center gap-1.5 px-3.5 h-9 text-[13px] font-semibold text-[#2563EB] dark:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create New</span>
            </button>
            <span className="w-px h-9 bg-[#3B82F6]/40 dark:bg-blue-500/40" />
            <button
              type="button"
              onClick={() => setCreateMenuOpen((prev) => !prev)}
              className="px-2.5 h-9 text-[#2563EB] dark:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors flex items-center justify-center"
              aria-label="More creation options"
            >
              <ChevronDown className="w-3.5 h-3.5 stroke-[2.25]" />
            </button>
          </div>

          {createMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setCreateMenuOpen(false)}
              />
              <div className="absolute right-0 top-11 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1.5 z-40 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setCreateMenuOpen(false);
                    openCreateModal('todo');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-medium"
                >
                  <Plus className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>New Task (To Do)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreateMenuOpen(false);
                    openCreateModal('in-progress');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>New Active Sprint Task</span>
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                <button
                  type="button"
                  onClick={handleExportTasks}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-medium"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export Board JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreateMenuOpen(false);
                    resetWorkspaceData();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Board</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-[18px] h-[18px] stroke-[1.75]" />
          ) : (
            <Sun className="w-[18px] h-[18px] text-amber-400 stroke-[1.75]" />
          )}
        </button>

        {/* Help (?) Speech-box Icon matching reference */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setHelpOpen((prev) => !prev)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
            title="Workspace Shortcuts & Help"
            aria-label="Workspace Help"
          >
            <svg
              className="w-[19px] h-[19px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>

          {helpOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setHelpOpen(false)} />
              <div className="absolute right-0 top-11 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-4 z-40 text-xs space-y-3">
                <div className="font-semibold text-slate-900 dark:text-white text-sm">
                  TaskFlow Shortcuts & Rules
                </div>
                <div className="space-y-2 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Focus Global Search</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[11px] font-mono">
                      ⌘ + F
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Transition Task Status</span>
                    <span className="text-[11px] text-slate-400">Drag & Drop Card</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Overdue Auto-Detection</span>
                    <span className="text-[11px] text-rose-500 font-medium">dueDate &lt; Today</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications Bell with Unread Red Dot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setUnreadNotif(false);
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-[19px] h-[19px] stroke-[1.75]" />
            {unreadNotif && (
              <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 absolute top-2 right-2" />
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-11 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-3.5 z-40 text-xs">
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">
                    Workspace Updates
                  </span>
                  <span className="text-[11px] text-[#2563EB] dark:text-blue-400 font-semibold tabular-nums">
                    {stats.overdue} Overdue
                  </span>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto kanban-scroll">
                  {activities.slice(0, 5).map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50/80 dark:bg-slate-700/40"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-800 dark:text-slate-100 font-medium truncate">
                          {act.action}: {act.taskTitle}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {act.project} · {act.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* User Profile Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 py-1 pl-1 pr-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
          >
            {/* Studio Portrait Avatar SVG */}
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden="true">
                <rect width="40" height="40" fill="#E2E8F0" />
                <circle cx="20" cy="20" r="20" fill="#CBD5E1" />
                {/* Shoulders / Jacket */}
                <path
                  d="M7 40C7 32.5 12.5 28 20 28C27.5 28 33 32.5 33 40H7Z"
                  fill="#475569"
                />
                {/* Collar */}
                <path d="M16 28L20 33L24 28H16Z" fill="#F8FAFC" />
                {/* Neck */}
                <rect x="17.5" y="23" width="5" height="6" rx="2" fill="#E5B899" />
                {/* Face */}
                <ellipse cx="20" cy="17.5" rx="6.2" ry="7.2" fill="#F1C6A7" />
                {/* Hair */}
                <path
                  d="M13.5 16.5C13.5 11.5 16.2 9 20.2 9C24.2 9 26.5 11.5 26.5 16C25.2 13.8 22.8 12.8 19.5 13C16.5 13.2 14.8 14.5 13.5 16.5Z"
                  fill="#1E293B"
                />
              </svg>
            </div>

            <div className="hidden md:block leading-tight">
              <div className="text-[13.5px] font-bold text-slate-900 dark:text-white whitespace-nowrap">
                {currentUser.name}
              </div>
              <div className="text-[11.5px] font-medium text-slate-400 dark:text-slate-400 whitespace-nowrap mt-0.5">
                {currentUser.role}
              </div>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block ml-1" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1.5 z-40 text-xs">
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Switch Active Profile
                  </div>
                  <div className="text-[11px] text-slate-400">Workspace Persona</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentUser({ name: 'Reyhan Adinata', role: 'Lead Product' });
                    setProfileOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/60 ${
                    currentUser.name === 'Reyhan Adinata'
                      ? 'text-[#2563EB] font-semibold'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>Reyhan Adinata</span>
                  <span className="text-[11px] text-slate-400">Lead Product</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentUser({ name: 'Alex Morgan', role: 'Product Manager' });
                    setProfileOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/60 ${
                    currentUser.name === 'Alex Morgan'
                      ? 'text-[#2563EB] font-semibold'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>Alex Morgan</span>
                  <span className="text-[11px] text-slate-400">Product Manager</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
