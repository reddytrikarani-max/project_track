export type UserRole = 'admin' | 'officer' | 'project_manager' | 'field_officer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  designation: string;
  avatar: string;
  email: string;
  jurisdiction: string;
}

export type EarlyWarningStatus = 'green' | 'yellow' | 'orange' | 'red';

export type ProjectSector =
  | 'Highways & Expressways'
  | 'Flyovers & Bridges'
  | 'Water Supply & Grids'
  | 'Urban Metro & Transit'
  | 'Port & Energy Logistics';

export interface Milestone {
  id: string;
  title: string;
  category: 'Clearance' | 'Civil Works' | 'Procurement' | 'Inspection' | 'Commissioning' | 'Utility Shifting';
  plannedDate: string;
  actualDate?: string;
  weightage: number; // percentage of project total
  progress: number; // 0 - 100%
  status: 'completed' | 'in_progress' | 'delayed' | 'pending';
  criticalPath: boolean;
  remarks?: string;
}

export interface RiskIssue {
  id: string;
  title: string;
  category:
    | 'Land Acquisition'
    | 'Environmental Clearance'
    | 'Utility Shifting'
    | 'Contractor Liquidity'
    | 'Weather & Disaster'
    | 'Legal Dispute';
  severity: 'low' | 'medium' | 'high' | 'critical';
  impactCostCr: number; // ₹ Cr
  impactDelayDays: number;
  reportedDate: string;
  targetResolutionDate: string;
  assignedAuthority: string;
  mitigationPlan: string;
  status: 'open' | 'mitigating' | 'escalated_to_pmo' | 'resolved';
}

export interface ProjectFinancials {
  sanctionedBudgetCr: number; // in ₹ Crores
  revisedBudgetCr: number;
  disbursedCr: number;
  utilizedExpenditureCr: number;
  unspentBalanceCr: number;
  costOverrunAlert: boolean;
  costOverrunEstimateCr: number;
  financialProgressPercent: number;
  monthlyExpenditure: { month: string; plannedCr: number; actualCr: number }[];
}

export interface FieldUpdate {
  id: string;
  projectId: string;
  officerName: string;
  officerRole: string;
  timestamp: string;
  siteLocation: string;
  reportedPhysicalProgress: number;
  weatherCondition: string;
  workforceCount: number;
  machineryActive: number;
  remarks: string;
  photos: string[];
  verified: boolean;
  blockerFlagged: boolean;
  blockerDetails?: string;
}

export interface ProjectLocation {
  state: string;
  district: string;
  city: string;
  coordinates: { lat: number; lng: number };
  svgCoords: { x: number; y: number }; // normalized 0-100 coordinates on India SVG map
}

export interface Project {
  id: string;
  code: string;
  name: string;
  sector: ProjectSector;
  executingAgency: string; // e.g. NHAI, DMRC, Jal Nigam, MMRDA
  contractor: string;
  startDate: string;
  plannedCompletionDate: string;
  revisedCompletionDate: string;
  earlyWarningStatus: EarlyWarningStatus;
  warningReasons: string[];
  healthScore: number; // 0-100
  physicalProgress: {
    planned: number; // %
    actual: number; // %
    slippage: number; // planned - actual %
    trend: 'improving' | 'stable' | 'declining';
  };
  financials: ProjectFinancials;
  milestones: Milestone[];
  risks: RiskIssue[];
  location: ProjectLocation;
  recentUpdates: FieldUpdate[];
  aiBrief?: string;
}

export interface NotificationItem {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  type: 'critical_delay' | 'cost_overrun' | 'milestone_breach' | 'high_risk' | 'field_alert';
  title: string;
  message: string;
  timestamp: string;
  severity: EarlyWarningStatus;
  read: boolean;
}

export interface FilterState {
  search: string;
  sector: string;
  warningStatus: string;
  state: string;
  sortBy: 'health' | 'slippage' | 'budget' | 'progress';
}
