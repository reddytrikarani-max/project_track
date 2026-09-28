import React, { useState, useEffect } from 'react';
import { Project, User } from '../types';
import {
  generatePortfolioAiSummary,
  generateProjectRemediationPlan,
  askDrishtiAi,
  AiPortfolioSummary,
  ProjectRemediationPlan
} from '../services/geminiService';
import { EarlyWarningBadge } from './EarlyWarningBadge';
import {
  Sparkles,
  RefreshCw,
  Send,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Bot,
  User as UserIcon,
  HelpCircle,
  Building2
} from 'lucide-react';

interface Props {
  projects: Project[];
  currentUser: User;
  initialSelectedProject?: Project;
}

export const AiInsightsView: React.FC<Props> = ({
  projects,
  currentUser,
  initialSelectedProject
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'portfolio' | 'project' | 'chat'>('portfolio');

  // Portfolio Summary State
  const [portfolioSummary, setPortfolioSummary] = useState<AiPortfolioSummary | null>(null);
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState<boolean>(false);

  // Project Remediation State
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialSelectedProject?.id || projects[0]?.id || ''
  );
  const [remediationPlan, setRemediationPlan] = useState<ProjectRemediationPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; timestamp: string }[]
  >([
    {
      role: 'assistant',
      text: 'Namaste! I am Drishti AI, your infrastructure analytics & remediation advisor. Ask me anything about project delays, Capex overruns, critical path hindrances, or ministerial escalations.',
      timestamp: 'Just now'
    }
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  // On mount or tab switch, generate initial portfolio summary if not present
  useEffect(() => {
    if (!portfolioSummary && !isGeneratingPortfolio) {
      handleGeneratePortfolioSummary();
    }
  }, []);

  // Update selected project if prop changes
  useEffect(() => {
    if (initialSelectedProject) {
      setSelectedProjectId(initialSelectedProject.id);
      setActiveSubTab('project');
      handleGenerateProjectPlan(initialSelectedProject);
    }
  }, [initialSelectedProject]);

  const handleGeneratePortfolioSummary = async () => {
    setIsGeneratingPortfolio(true);
    try {
      const summary = await generatePortfolioAiSummary(projects);
      setPortfolioSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPortfolio(false);
    }
  };

  const handleGenerateProjectPlan = async (projectToUse?: Project) => {
    const proj = projectToUse || projects.find((p) => p.id === selectedProjectId);
    if (!proj) return;

    setIsGeneratingPlan(true);
    try {
      const plan = await generateProjectRemediationPlan(proj);
      setRemediationPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const query = queryText || userQuery;
    if (!query.trim() || isQuerying) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newHistory = [
      ...chatMessages,
      { role: 'user' as const, text: query, timestamp: timeStr }
    ];
    setChatMessages(newHistory);
    setUserQuery('');
    setIsQuerying(true);

    try {
      const response = await askDrishtiAi(query, projects);
      setChatMessages([
        ...newHistory,
        { role: 'assistant' as const, text: response, timestamp: timeStr }
      ]);
    } catch {
      setChatMessages([
        ...newHistory,
        {
          role: 'assistant' as const,
          text: 'Encountered a momentary interruption in processing the request. Please retry.',
          timestamp: timeStr
        }
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  const sampleQueries = [
    'Which projects have cost overruns exceeding ₹200 Cr?',
    'What are the primary utility shifting bottlenecks?',
    'Summarize critical risks for the Bundelkhand Water Grid',
    'Draft a PMO urgent intervention note for Chennai Coastal Viaduct'
  ];

  const currentSelectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-5 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Powered by Google Gemini GenAI
            </span>
            <span className="text-xs text-slate-400">ProjectDrishti Strategic Core</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
            Drishti AI Infrastructure Intelligence Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Automated predictive delay modeling, root-cause forensics, and contractor turnaround plans for large public infrastructure.
          </p>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab('portfolio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'portfolio'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Portfolio Diagnosis
          </button>
          <button
            onClick={() => {
              setActiveSubTab('project');
              if (!remediationPlan) handleGenerateProjectPlan();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'project'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Project Advisor
          </button>
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'chat'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ask Drishti AI
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PORTFOLIO DIAGNOSIS */}
      {activeSubTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              National Portfolio Strategic Diagnosis
            </h2>
            <button
              onClick={handleGeneratePortfolioSummary}
              disabled={isGeneratingPortfolio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingPortfolio ? 'animate-spin' : ''}`} />
              <span>{isGeneratingPortfolio ? 'Analyzing Telemetry...' : 'Refresh AI Analysis'}</span>
            </button>
          </div>

          {isGeneratingPortfolio ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20" />
                <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Evaluating multi-project telemetry and contractor variance...
              </p>
              <p className="text-xs text-slate-400">
                Generating national delay impact forecast and Capex exposure assessment
              </p>
            </div>
          ) : portfolioSummary ? (
            <div className="space-y-6">
              {/* Executive Diagnostic Brief */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Executive Summary & Systemic Diagnostic</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Cabinet Briefing Grade
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 whitespace-pre-line">
                  {portfolioSummary.executiveBrief}
                </div>
              </div>

              {/* Capex Risk Analysis Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-900 border border-rose-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-300">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Fiscal Risk & Escrow Intervention Mandate</span>
                  </span>
                  <span className="font-mono text-rose-400 font-extrabold text-sm">
                    Overrun Risk: ₹{portfolioSummary.capexRiskAnalysis.totalOverrunEstimateCr.toLocaleString()} Cr
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Highest Vulnerability Asset:</strong> {portfolioSummary.capexRiskAnalysis.highestRiskProject}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  <strong>Recommended Escrow Directive:</strong> {portfolioSummary.capexRiskAnalysis.recommendedEscrowMeasures}
                </p>
              </div>

              {/* Critical Path Bottlenecks & Ministerial Directives */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Project-Specific Critical Path Action Directives
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolioSummary.criticalPathAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 truncate max-w-[200px]">
                          {alert.projectName}
                        </span>
                        <EarlyWarningBadge status={alert.warningLevel} size="sm" />
                      </div>

                      <div className="text-xs text-slate-400">
                        <span className="text-slate-500 font-mono uppercase text-[10px] block">
                          Root Cause
                        </span>
                        <p className="text-slate-300 line-clamp-2 mt-0.5">{alert.rootCause}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                        <span className="text-amber-400 font-bold text-[10px] uppercase block">
                          Ministerial Action Directive
                        </span>
                        <p className="text-slate-200 mt-0.5">{alert.actionItem}</p>
                      </div>

                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                        <span>Responsible Agency:</span>
                        <span className="text-slate-300 font-medium truncate max-w-[150px]">
                          {alert.authorityResponsible}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Remediations for Mega Infrastructure */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Strategic Policy De-Bottlenecking Recommendations</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {portfolioSummary.policyRemediations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* SUB-TAB 2: PROJECT-SPECIFIC REMEDIATION ADVISOR */}
      {activeSubTab === 'project' && (
        <div className="space-y-6">
          {/* Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400 font-medium">Select Infrastructure Asset:</div>
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    const p = projects.find((proj) => proj.id === e.target.value);
                    if (p) handleGenerateProjectPlan(p);
                  }}
                  className="mt-1 px-3 py-1.5 text-xs bg-slate-950 text-slate-100 font-bold rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.earlyWarningStatus.toUpperCase()}] {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => handleGenerateProjectPlan()}
              disabled={isGeneratingPlan}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingPlan ? 'Formulating Plan...' : 'Regenerate Turnaround Plan'}</span>
            </button>
          </div>

          {/* Project Plan Output */}
          {isGeneratingPlan ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20" />
                <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Formulating Turnaround Plan for {currentSelectedProject?.name}...
              </p>
            </div>
          ) : remediationPlan ? (
            <div className="space-y-6">
              {/* Diagnostic Box */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="font-bold uppercase tracking-wider text-amber-400">
                    Engineering Diagnostic Verdict
                  </span>
                  <EarlyWarningBadge status={currentSelectedProject.earlyWarningStatus} size="sm" />
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {remediationPlan.diagnosticVerdict}
                </p>
              </div>

              {/* Recovery Milestone Steps */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Critical Path Recovery Timeline (30-Day Sprint)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {remediationPlan.scheduleRecoveryPlan.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold">
                          <span>STEP {idx + 1}</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {step.timeline}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-100 mt-1">{step.step}</h4>
                      </div>
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold">
                        Impact: {step.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Safeguards & Inter-Departmental Clearances */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Safeguards */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Financial & Contractual Safeguards
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {remediationPlan.financialSafeguards.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0">₹</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clearances */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Inter-Departmental Clearances to Expedite
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {remediationPlan.interDepartmentalClearances.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Field Officer Checklist */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  On-Site Field Officer Enforcement Protocol
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {remediationPlan.fieldEnforcementChecklist.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2">
                      <span className="text-emerald-400 font-mono font-bold">{i + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* SUB-TAB 3: ASK DRISHTI AI (CHAT ASSISTANT) */}
      {activeSubTab === 'chat' && (
        <div className="space-y-4">
          {/* Sample Prompts */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Try Asking:
            </span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Conversation Thread */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 min-h-[400px] max-h-[550px] overflow-y-auto space-y-4">
            {chatMessages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={index}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-amber-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                      isAssistant
                        ? 'bg-slate-950/80 text-slate-200 border border-slate-800'
                        : 'bg-amber-500 text-slate-950 font-semibold'
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans">
                      {msg.text}
                    </div>
                    <div
                      className={`text-[10px] text-right font-mono ${
                        isAssistant ? 'text-slate-500' : 'text-slate-800'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                      <UserIcon className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}

            {isQuerying && (
              <div className="flex gap-3 items-center text-xs text-amber-400">
                <Bot className="w-4 h-4 animate-spin" />
                <span>Drishti AI is querying infrastructure telemetry and generating brief...</span>
              </div>
            )}
          </div>

          {/* Prompt Input Bar */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask Drishti AI about any project delay, Capex expenditure, or risk mitigation..."
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!userQuery.trim() || isQuerying}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
