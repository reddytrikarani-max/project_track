/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, User, NotificationItem, FieldUpdate } from './types';
import { MOCK_USERS, INITIAL_PROJECTS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ProjectTrackerView } from './components/ProjectTrackerView';
import { CapexFinancialsView } from './components/CapexFinancialsView';
import { EarlyWarningRiskView } from './components/EarlyWarningRiskView';
import { MapView } from './components/MapView';
import { AiInsightsView } from './components/AiInsightsView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { FieldUpdatesModal } from './components/FieldUpdatesModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { NewProjectModal } from './components/NewProjectModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Default to Admin
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers state
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);
  const [selectedProjectForAi, setSelectedProjectForAi] = useState<Project | undefined>(undefined);
  const [fieldUpdateModalOpen, setFieldUpdateModalOpen] = useState<boolean>(false);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState<boolean>(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState<boolean>(false);

  // Milestone Progress Update
  const handleUpdateMilestoneProgress = (projectId: string, milestoneId: string, newProgress: number) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;

        const updatedMilestones = proj.milestones.map((m) => {
          if (m.id !== milestoneId) return m;
          const status = newProgress >= 100 ? 'completed' : newProgress > 0 ? 'in_progress' : m.status;
          return {
            ...m,
            progress: newProgress,
            status,
            actualDate: newProgress >= 100 ? new Date().toISOString().split('T')[0] : m.actualDate
          };
        });

        // Recalculate physical progress based on weightage
        const totalCalculated = updatedMilestones.reduce(
          (acc, m) => acc + (m.progress * m.weightage) / 100,
          0
        );
        const actual = Number(totalCalculated.toFixed(1));
        const slippage = Number((proj.physicalProgress.planned - actual).toFixed(1));

        return {
          ...proj,
          milestones: updatedMilestones,
          physicalProgress: {
            ...proj.physicalProgress,
            actual,
            slippage,
            trend: slippage <= 5 ? 'improving' : 'declining'
          }
        };
      })
    );
  };

  // Escalate Risk to PMO
  const handleEscalateRisk = (projectId: string, riskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          risks: p.risks.map((r) => {
            if (r.id !== riskId) return r;
            return {
              ...r,
              status: 'escalated_to_pmo' as const
            };
          })
        };
      })
    );

    const targetProject = projects.find((p) => p.id === projectId);
    const targetRisk = targetProject?.risks.find((r) => r.id === riskId);

    // Add alert notification
    if (targetProject && targetRisk) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        projectId: targetProject.id,
        projectCode: targetProject.code,
        projectName: targetProject.name,
        type: 'high_risk',
        title: `ESCALATION TO PMO: ${targetRisk.title}`,
        message: `Escalated by ${currentUser.name} (${currentUser.roleTitle}). Assigned Authority: ${targetRisk.assignedAuthority}`,
        timestamp: 'Just now',
        severity: targetProject.earlyWarningStatus,
        read: false
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Submit Field Update
  const handleSubmitFieldUpdate = (update: FieldUpdate) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== update.projectId) return p;

        const newActual = update.reportedPhysicalProgress;
        const slippage = Number((p.physicalProgress.planned - newActual).toFixed(1));

        // Re-evaluate warning status
        let newStatus = p.earlyWarningStatus;
        if (slippage > 25) newStatus = 'red';
        else if (slippage > 15) newStatus = 'orange';
        else if (slippage > 5) newStatus = 'yellow';
        else newStatus = 'green';

        return {
          ...p,
          earlyWarningStatus: newStatus,
          physicalProgress: {
            ...p.physicalProgress,
            actual: newActual,
            slippage,
            trend: slippage > 5 ? 'declining' : 'improving'
          },
          recentUpdates: [update, ...p.recentUpdates]
        };
      })
    );

    const project = projects.find((p) => p.id === update.projectId);
    if (project) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        projectId: project.id,
        projectCode: project.code,
        projectName: project.name,
        type: 'field_alert',
        title: `Field Inspection Logged: ${update.siteLocation}`,
        message: `Reported by ${update.officerName} (${update.officerRole}). Progress: ${update.reportedPhysicalProgress}%. ${update.remarks}`,
        timestamp: 'Just now',
        severity: update.blockerFlagged ? 'red' : 'green',
        read: false
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Add Project
  const handleAddProject = (newProj: Project) => {
    setProjects((prev) => [newProj, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      projectId: newProj.id,
      projectCode: newProj.code,
      projectName: newProj.name,
      type: 'field_alert',
      title: `New Project Corridor Onboarded: ${newProj.code}`,
      message: `Project ${newProj.name} (${newProj.sector}) registered with ₹${newProj.financials.sanctionedBudgetCr} Cr Capex.`,
      timestamp: 'Just now',
      severity: newProj.earlyWarningStatus,
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Open AI View with pre-selected project
  const handleOpenAiForProject = (project: Project) => {
    setSelectedProjectForAi(project);
    setActiveTab('ai');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar with Role-Switcher & Search */}
      <Navbar
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        availableUsers={MOCK_USERS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onOpenNotifications={() => setNotificationsDrawerOpen(true)}
        onOpenFieldUpdateModal={() => setFieldUpdateModalOpen(true)}
        onOpenNewProjectModal={() => setNewProjectModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            projects={projects}
            currentUser={currentUser}
            onSelectProject={setSelectedProjectForDetail}
            onOpenAiForProject={handleOpenAiForProject}
            onNavigateToAi={() => setActiveTab('ai')}
            onEscalateRisk={handleEscalateRisk}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'tracker' && (
          <ProjectTrackerView
            projects={projects}
            currentUser={currentUser}
            onUpdateMilestoneProgress={handleUpdateMilestoneProgress}
            onSelectProject={setSelectedProjectForDetail}
            onOpenAiForProject={handleOpenAiForProject}
          />
        )}

        {activeTab === 'financials' && (
          <CapexFinancialsView
            projects={projects}
            currentUser={currentUser}
            onSelectProject={setSelectedProjectForDetail}
            onOpenAiForProject={handleOpenAiForProject}
          />
        )}

        {activeTab === 'risks' && (
          <EarlyWarningRiskView
            projects={projects}
            currentUser={currentUser}
            onEscalateRisk={handleEscalateRisk}
            onSelectProject={setSelectedProjectForDetail}
            onOpenAiForProject={handleOpenAiForProject}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            projects={projects}
            onSelectProject={setSelectedProjectForDetail}
            onOpenAiForProject={handleOpenAiForProject}
          />
        )}

        {activeTab === 'ai' && (
          <AiInsightsView
            projects={projects}
            currentUser={currentUser}
            initialSelectedProject={selectedProjectForAi}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>ProjectDrishti &bull; National Infrastructure Early-Warning Command System</span>
          </div>
          <span>Built for Smart India Hackathon &bull; PM Gati Shakti Master Plan Integration</span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProjectDetailModal
        project={selectedProjectForDetail}
        currentUser={currentUser}
        onClose={() => setSelectedProjectForDetail(null)}
        onOpenAi={handleOpenAiForProject}
        onEscalateRisk={handleEscalateRisk}
      />

      <FieldUpdatesModal
        isOpen={fieldUpdateModalOpen}
        onClose={() => setFieldUpdateModalOpen(false)}
        projects={projects}
        currentUser={currentUser}
        onSubmitUpdate={handleSubmitFieldUpdate}
      />

      <NotificationsDrawer
        isOpen={notificationsDrawerOpen}
        onClose={() => setNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onSelectProjectById={(id) => {
          const p = projects.find((proj) => proj.id === id);
          if (p) setSelectedProjectForDetail(p);
        }}
      />

      <NewProjectModal
        isOpen={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
        onAddProject={handleAddProject}
      />
    </div>
  );
}
