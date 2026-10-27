import React, { useState } from 'react';
import {
  LayoutGrid,
  ChevronUp,
  ChevronDown,
  Flag,
  ClipboardList,
  Calendar,
  LineChart,
  Users,
  FileText,
  Share2,
  Settings,
  ArrowLeftToLine,
  ArrowRightFromLine,
  X,
} from 'lucide-react';
import { useTasks, TaskStatus } from '../context/TaskContext';
import { ProjectIcon } from './ProjectIcon';

export const Sidebar: React.FC = () => {
  const {
    stats,
    activeNav,
    setActiveNav,
    filters,
    setFilters,
    resetFilters,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    availableProjects,
    resetWorkspaceData,
  } = useTasks();

  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Active in-flight tasks count (To Do + In Progress = 3 + 3 = 6 in reference screenshot)
  const activeTaskBadgeCount = stats.toDo + stats.inProgress;

  const toggleSection = (key: string) => {
    setExpandedSection((prev) => (prev === key ? null : key));
  };

  const handleSelectNav = (navKey: string) => {
    setActiveNav(navKey);
    setIsMobileSidebarOpen(false);
  };

  const handleProjectQuickFilter = (proj: string) => {
    setActiveNav('my-tasks');
    setFilters((prev) => ({
      ...prev,
      project: prev.project === proj ? 'All' : proj,
    }));
    setIsMobileSidebarOpen(false);
  };

  const handleStatusQuickFilter = (status: TaskStatus | 'All') => {
    setActiveNav('my-tasks');
    setFilters((prev) => ({
      ...prev,
      status: prev.status === status ? 'All' : status,
    }));
    setIsMobileSidebarOpen(false);
  };

  const secondaryItems = [
    { key: 'projects', label: 'Projects', icon: Flag },
    { key: 'tasks', label: 'Tasks', icon: ClipboardList },
    { key: 'calendar', label: 'Calendar', icon: Calendar },
    { key: 'analytics', label: 'Analytics', icon: LineChart },
    { key: 'team', label: 'Team', icon: Users },
    { key: 'files', label: 'Files', icon: FileText },
    { key: 'integrations', label: 'Integrations', icon: Share2 },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderSidebarContent = (isMobile = false) => {
    const collapsed = isSidebarCollapsed && !isMobile;

    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 select-none transition-all duration-200">
        {/* Top Brand Row */}
        <div
          className={`h-[72px] flex items-center ${
            collapsed ? 'justify-center px-2' : 'justify-between px-6'
          } border-b border-slate-100 dark:border-slate-800/80 shrink-0`}
        >
          {!collapsed && (
            <button
              type="button"
              onClick={() => {
                resetFilters();
                setActiveNav('my-tasks');
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              {/* Brand emblem matching the blue circle dual-lobe mark in reference */}
              <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors shrink-0">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 6.5C7 5.67 7.67 5 8.5 5h1.2c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5H8.5C7.67 19 7 18.33 7 17.5v-11zm5.8 0c0-.83.67-1.5 1.5-1.5h1.2c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-1.2c-.83 0-1.5-.67-1.5-1.5v-11z" />
                </svg>
              </div>
              <span className="text-[21px] font-bold tracking-tight text-[#2563EB] dark:text-blue-400 whitespace-nowrap">
                TaskFlow
              </span>
            </button>
          )}

          {isMobile ? (
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              aria-label="Close navigation menu"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ArrowRightFromLine className="w-3.5 h-3.5" />
              ) : (
                <ArrowLeftToLine className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Links Scroll Container */}
        <div className="flex-1 overflow-y-auto kanban-scroll py-2">
          {/* Primary Dashboard Group */}
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2">
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  setIsSidebarCollapsed(false);
                  setDashboardOpen(true);
                } else {
                  setDashboardOpen((prev) => !prev);
                }
              }}
              className={`w-full flex items-center ${
                collapsed ? 'justify-center px-2' : 'justify-between px-6'
              } py-3 text-[14px] font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors`}
            >
              <span className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 text-slate-900 dark:text-slate-100 fill-current shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">Dashboard</span>}
              </span>
              {!collapsed &&
                (dashboardOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ))}
            </button>

            {!collapsed && dashboardOpen && (
              <div className="mt-0.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleSelectNav('overview')}
                  className={`w-full flex items-center justify-between pl-12 pr-6 py-2.5 text-[13.5px] transition-colors ${
                    activeNav === 'overview'
                      ? 'bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 font-semibold border-r-[3px] border-[#2563EB]'
                      : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span className="whitespace-nowrap">Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectNav('my-tasks')}
                  className={`w-full flex items-center justify-between pl-12 pr-5 py-2.5 text-[13.5px] transition-colors ${
                    activeNav === 'my-tasks'
                      ? 'bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 font-semibold border-r-[3px] border-[#2563EB]'
                      : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span className="whitespace-nowrap">My Tasks</span>
                  <span className="inline-flex items-center justify-center min-w-[22px] h-[20px] px-1.5 rounded-full bg-[#DBEAFE] dark:bg-blue-900/70 text-[#2563EB] dark:text-blue-300 text-[11px] font-bold tabular-nums">
                    {activeTaskBadgeCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectNav('activity')}
                  className={`w-full flex items-center justify-between pl-12 pr-6 py-2.5 text-[13.5px] transition-colors ${
                    activeNav === 'activity'
                      ? 'bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 font-semibold border-r-[3px] border-[#2563EB]'
                      : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span className="whitespace-nowrap">Activity</span>
                </button>
              </div>
            )}
          </div>

          {/* Secondary Accordion Navigation Links matching reference screenshot */}
          <div>
            {secondaryItems.map((item) => {
              const IconComponent = item.icon;
              const isOpen = expandedSection === item.key && !collapsed;

              return (
                <div
                  key={item.key}
                  className="border-b border-slate-100 dark:border-slate-800/80"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (collapsed) {
                        setIsSidebarCollapsed(false);
                        setExpandedSection(item.key);
                      } else if (item.key === 'analytics') {
                        handleSelectNav('overview');
                      } else if (item.key === 'calendar') {
                        handleSelectNav('calendar');
                      } else {
                        toggleSection(item.key);
                      }
                    }}
                    className={`w-full flex items-center ${
                      collapsed ? 'justify-center px-2' : 'justify-between px-6'
                    } py-3.5 text-[13.5px] font-medium transition-colors ${
                      activeNav === item.key
                        ? 'text-[#2563EB] dark:text-blue-400 bg-[#EFF6FF]/60 dark:bg-blue-950/30 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="flex items-center gap-3">
                      <IconComponent className="w-[17px] h-[17px] text-slate-400 dark:text-slate-400 shrink-0 stroke-[1.75]" />
                      {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                    </span>
                    {!collapsed &&
                      (isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ))}
                  </button>

                  {/* Contextual sub-menus for interactive workflow */}
                  {isOpen && item.key === 'projects' && (
                    <div className="pb-2.5 pt-0.5 space-y-0.5 max-h-52 overflow-y-auto kanban-scroll">
                      <button
                        type="button"
                        onClick={() => handleProjectQuickFilter('All')}
                        className={`w-full flex items-center justify-between pl-12 pr-6 py-1.5 text-xs font-medium ${
                          filters.project === 'All'
                            ? 'text-[#2563EB] font-semibold'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <span>All Projects</span>
                        <span className="tabular-nums text-[11px] text-slate-400">
                          {availableProjects.length}
                        </span>
                      </button>
                      {availableProjects.slice(0, 8).map((proj) => (
                        <button
                          key={proj}
                          type="button"
                          onClick={() => handleProjectQuickFilter(proj)}
                          className={`w-full flex items-center gap-2 pl-12 pr-6 py-1.5 text-xs font-medium truncate ${
                            filters.project === proj
                              ? 'text-[#2563EB] bg-blue-50/60 dark:bg-blue-950/40 font-semibold'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          <ProjectIcon project={proj} className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{proj}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {isOpen && item.key === 'tasks' && (
                    <div className="pb-2.5 pt-0.5 space-y-0.5">
                      {(
                        [
                          { id: 'All', label: 'All Tasks', count: stats.total },
                          { id: 'todo', label: 'To Do', count: stats.toDo },
                          { id: 'in-progress', label: 'In Progress', count: stats.inProgress },
                          { id: 'completed', label: 'Completed', count: stats.completed },
                          { id: 'overdue', label: 'Overdue', count: stats.overdue },
                        ] as const
                      ).map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleStatusQuickFilter(st.id)}
                          className={`w-full flex items-center justify-between pl-12 pr-6 py-1.5 text-xs font-medium ${
                            filters.status === st.id
                              ? 'text-[#2563EB] font-semibold'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          <span>{st.label}</span>
                          <span className="tabular-nums text-[11px] text-slate-400">{st.count}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {isOpen && item.key === 'team' && (
                    <div className="pb-2.5 pt-0.5 px-6 pl-12 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 dark:text-slate-200">Reyhan Adinata</span>
                        <span className="text-[11px] text-slate-400">Lead</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 dark:text-slate-200">Alex Morgan</span>
                        <span className="text-[11px] text-slate-400">PM</span>
                      </div>
                    </div>
                  )}

                  {isOpen && (item.key === 'files' || item.key === 'integrations') && (
                    <div className="pb-2.5 pt-0.5 pl-12 pr-6 text-xs text-slate-500 dark:text-slate-400">
                      <button
                        type="button"
                        onClick={() => handleSelectNav('my-tasks')}
                        className="text-left hover:text-[#2563EB] transition-colors"
                      >
                        {item.key === 'files'
                          ? 'View attached specs on board'
                          : 'Connected: Figma, GitHub, Slack'}
                      </button>
                    </div>
                  )}

                  {isOpen && item.key === 'settings' && (
                    <div className="pb-3 pt-1 pl-12 pr-6 space-y-1.5">
                      <button
                        type="button"
                        onClick={resetWorkspaceData}
                        className="w-full text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Reset Board to Reference Demo
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 h-screen sticky top-0 z-30 transition-all duration-200 ${
          isSidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="relative w-[260px] max-w-[82vw] h-full z-10 shadow-xl">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
