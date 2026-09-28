import { Project, User, NotificationItem } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Rajeshwar Sharma',
    role: 'admin',
    roleTitle: 'System Super Administrator',
    department: 'PM Gati Shakti National Master Plan Cell',
    designation: 'Director (Digital Governance & Analytics)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'admin.gati@drishti.gov.in',
    jurisdiction: 'National Command Center, New Delhi'
  },
  {
    id: 'user-officer',
    name: 'Dr. Anita Iyer, IAS',
    role: 'officer',
    roleTitle: 'Ministry Reviewing Officer',
    department: 'Ministry of Road Transport & Public Works',
    designation: 'Principal Secretary (Infrastructure Monitoring)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'anita.iyer.ias@gov.in',
    jurisdiction: 'Central Monitoring Division, MoRTH'
  },
  {
    id: 'user-pm',
    name: 'Er. Sanjay Kulkarni',
    role: 'project_manager',
    roleTitle: 'Chief Project Manager',
    department: 'NHAI & Special Corridor Implementation Agency',
    designation: 'Chief General Manager (Technical / Projects)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'sanjay.kulkarni@nhai.gov.in',
    jurisdiction: 'North & Western Zone Infrastructure Projects'
  },
  {
    id: 'user-field',
    name: 'Er. Rohit Meena',
    role: 'field_officer',
    roleTitle: 'Resident Field Officer',
    department: 'Site Supervision & Quality Assurance Directorate',
    designation: 'Superintending Resident Site Engineer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    email: 'rohit.meena.site@nhai.gov.in',
    jurisdiction: 'Sector 84 Site Office, Gurugram / Bundelkhand Section'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    code: 'NHAI-2024-EXP-08',
    name: 'Dwarka Expressway Package 3 (Elevated Expressway & Cloverleaf)',
    sector: 'Highways & Expressways',
    executingAgency: 'National Highways Authority of India (NHAI)',
    contractor: 'Larsen & Toubro Heavy Civil Infrastructure',
    startDate: '2022-04-15',
    plannedCompletionDate: '2024-12-31',
    revisedCompletionDate: '2025-06-30',
    earlyWarningStatus: 'orange',
    warningReasons: [
      'High-tension electrical utility shifting delayed by 115 days near Bajghera crossing',
      'Physical progress slippage of 14.8% over planned timeline',
      'Rerouting clearance pending from Haryana Town & Country Planning'
    ],
    healthScore: 61,
    physicalProgress: {
      planned: 86.4,
      actual: 71.6,
      slippage: 14.8,
      trend: 'declining'
    },
    financials: {
      sanctionedBudgetCr: 8650,
      revisedBudgetCr: 9120,
      disbursedCr: 6800,
      utilizedExpenditureCr: 6540,
      unspentBalanceCr: 260,
      costOverrunAlert: true,
      costOverrunEstimateCr: 470,
      financialProgressPercent: 75.6,
      monthlyExpenditure: [
        { month: 'Oct 2025', plannedCr: 210, actualCr: 180 },
        { month: 'Nov 2025', plannedCr: 240, actualCr: 195 },
        { month: 'Dec 2025', plannedCr: 260, actualCr: 210 },
        { month: 'Jan 2026', plannedCr: 280, actualCr: 220 },
        { month: 'Feb 2026', plannedCr: 300, actualCr: 235 },
        { month: 'Mar 2026', plannedCr: 310, actualCr: 250 }
      ]
    },
    milestones: [
      {
        id: 'm-01-1',
        title: 'Foundation Piling & Substructure (Pier Caps)',
        category: 'Civil Works',
        plannedDate: '2023-08-30',
        actualDate: '2023-10-15',
        weightage: 25,
        progress: 100,
        status: 'completed',
        criticalPath: true,
        remarks: 'All 412 pier caps cast and inspected by CRRI'
      },
      {
        id: 'm-01-2',
        title: 'Pre-cast Segment Launching on Main Viaduct',
        category: 'Civil Works',
        plannedDate: '2024-05-15',
        actualDate: '2024-08-20',
        weightage: 30,
        progress: 88,
        status: 'in_progress',
        criticalPath: true,
        remarks: '12 launchers active; hindered by unshifted 66kV transmission cables'
      },
      {
        id: 'm-01-3',
        title: '66kV / 220kV High Tension Power Line Undergrounding',
        category: 'Utility Shifting',
        plannedDate: '2024-03-10',
        actualDate: undefined,
        weightage: 15,
        progress: 45,
        status: 'delayed',
        criticalPath: true,
        remarks: 'Severe ROW dispute near Sector 102; joint meeting with HVPNL required'
      },
      {
        id: 'm-01-4',
        title: 'Bituminous Wearing Coat & Crash Barriers',
        category: 'Civil Works',
        plannedDate: '2024-11-30',
        actualDate: undefined,
        weightage: 15,
        progress: 20,
        status: 'delayed',
        criticalPath: false,
        remarks: 'Dependent on segment launch completion'
      },
      {
        id: 'm-01-5',
        title: 'Intelligent Toll & Surveillance Management Commissioning',
        category: 'Commissioning',
        plannedDate: '2024-12-31',
        actualDate: undefined,
        weightage: 15,
        progress: 0,
        status: 'pending',
        criticalPath: false,
        remarks: 'Hardware procurement initiated'
      }
    ],
    risks: [
      {
        id: 'r-01-1',
        title: 'HVPNL 66kV Transmission Line Relocation Stalled',
        category: 'Utility Shifting',
        severity: 'critical',
        impactCostCr: 120,
        impactDelayDays: 75,
        reportedDate: '2024-02-14',
        targetResolutionDate: '2026-10-15',
        assignedAuthority: 'Superintending Engineer, HVPNL Gurugram',
        mitigationPlan: 'Escalate to Chief Secretary Haryana for emergency duct shutdown approval',
        status: 'escalated_to_pmo'
      },
      {
        id: 'r-01-2',
        title: 'Monsoon Waterlogging in Subway Underpass Pits',
        category: 'Weather & Disaster',
        severity: 'medium',
        impactCostCr: 35,
        impactDelayDays: 20,
        reportedDate: '2024-07-10',
        targetResolutionDate: '2026-10-05',
        assignedAuthority: 'L&T Project Director',
        mitigationPlan: 'Deploy 8 high-capacity dewatering diesel pumps and precast storm drain',
        status: 'mitigating'
      }
    ],
    location: {
      state: 'Haryana / NCR',
      district: 'Gurugram',
      city: 'Gurugram',
      coordinates: { lat: 28.4595, lng: 77.0266 },
      svgCoords: { x: 37, y: 31 }
    },
    recentUpdates: [
      {
        id: 'upd-01-1',
        projectId: 'proj-01',
        officerName: 'Er. Rohit Meena',
        officerRole: 'Field Officer',
        timestamp: '2026-09-27 16:30',
        siteLocation: 'Km 18+400 Bajghera Junction',
        reportedPhysicalProgress: 71.6,
        weatherCondition: 'Clear / 32°C',
        workforceCount: 380,
        machineryActive: 28,
        remarks: 'Viaduct span #42 successfully staged. Gas pipeline shifting work started by GAIL contractor.',
        photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'],
        verified: true,
        blockerFlagged: false
      }
    ],
    aiBrief: 'Dwarka Expressway Package 3 is experiencing an Orange At-Risk condition primarily driven by HVPNL utility shifting delays. While substructure progress is solid, the critical path segment launching will breach revised Q2 2025 deadlines without inter-departmental intervention.'
  },
  {
    id: 'proj-02',
    code: 'JJM-2023-WTR-42',
    name: 'Bundelkhand Multi-Village Rural Piped Drinking Water Grid',
    sector: 'Water Supply & Grids',
    executingAgency: 'State Water & Sanitation Mission (SWSM / Jal Nigam)',
    contractor: 'NCC Limited - Megha Engineering JV',
    startDate: '2022-08-10',
    plannedCompletionDate: '2024-11-15',
    revisedCompletionDate: '2025-10-31',
    earlyWarningStatus: 'red',
    warningReasons: [
      'Physical progress slippage is a critical 32.4% behind schedule',
      'Contractor working capital liquidity distress halting pipe procurement in 4 blocks',
      'Major cost escalation of ₹610 Cr triggered by rocky terrain micro-tunneling variance',
      'Overdue milestone: 18 Water Treatment Plants (WTPs) civil execution delayed by 8 months'
    ],
    healthScore: 38,
    physicalProgress: {
      planned: 78.2,
      actual: 45.8,
      slippage: 32.4,
      trend: 'declining'
    },
    financials: {
      sanctionedBudgetCr: 5200,
      revisedBudgetCr: 5810,
      disbursedCr: 3450,
      utilizedExpenditureCr: 3310,
      unspentBalanceCr: 140,
      costOverrunAlert: true,
      costOverrunEstimateCr: 610,
      financialProgressPercent: 63.6,
      monthlyExpenditure: [
        { month: 'Oct 2025', plannedCr: 140, actualCr: 65 },
        { month: 'Nov 2025', plannedCr: 160, actualCr: 70 },
        { month: 'Dec 2025', plannedCr: 180, actualCr: 85 },
        { month: 'Jan 2026', plannedCr: 190, actualCr: 80 },
        { month: 'Feb 2026', plannedCr: 210, actualCr: 95 },
        { month: 'Mar 2026', plannedCr: 230, actualCr: 105 }
      ]
    },
    milestones: [
      {
        id: 'm-02-1',
        title: 'Intake Well & Raw Water Sump Pump House Construction',
        category: 'Civil Works',
        plannedDate: '2023-06-30',
        actualDate: '2023-12-10',
        weightage: 20,
        progress: 100,
        status: 'completed',
        criticalPath: true,
        remarks: 'Betwa River intake completed after monsoon delays'
      },
      {
        id: 'm-02-2',
        title: '1,420 km HDPE & DI Pipeline Trunk Transmission Laying',
        category: 'Procurement',
        plannedDate: '2024-04-15',
        actualDate: undefined,
        weightage: 35,
        progress: 48,
        status: 'delayed',
        criticalPath: true,
        remarks: 'Rock trenching required special hydraulic breakers; DI pipe deliveries stalled'
      },
      {
        id: 'm-02-3',
        title: '18 Water Treatment Plants (WTP) Mechanical Installations',
        category: 'Civil Works',
        plannedDate: '2024-08-30',
        actualDate: undefined,
        weightage: 25,
        progress: 35,
        status: 'delayed',
        criticalPath: true,
        remarks: 'Contractor sub-vendors unpaid; supply chain breakages identified'
      },
      {
        id: 'm-02-4',
        title: 'Household Tap Connection (FHTC) Metering in 640 Villages',
        category: 'Commissioning',
        plannedDate: '2024-11-15',
        actualDate: undefined,
        weightage: 20,
        progress: 18,
        status: 'delayed',
        criticalPath: false,
        remarks: 'Slow progress awaiting main feeder pressurization'
      }
    ],
    risks: [
      {
        id: 'r-02-1',
        title: 'Contractor Working Capital Deficit & Bank Guarantee Cap',
        category: 'Contractor Liquidity',
        severity: 'critical',
        impactCostCr: 320,
        impactDelayDays: 140,
        reportedDate: '2024-01-19',
        targetResolutionDate: '2026-10-10',
        assignedAuthority: 'State Water Mission Committee / Finance Dept',
        mitigationPlan: 'Invoke direct payment clause for DI pipe manufacturers and escrow mechanism',
        status: 'escalated_to_pmo'
      },
      {
        id: 'r-02-2',
        title: 'Hard Granite Strata Requiring Heavy Controlled Blasting Permissions',
        category: 'Environmental Clearance',
        severity: 'high',
        impactCostCr: 110,
        impactDelayDays: 60,
        reportedDate: '2024-03-22',
        targetResolutionDate: '2026-10-25',
        assignedAuthority: 'District Magistrate Lalitpur & Jhansi',
        mitigationPlan: 'Expedite explosive controller clearances and substitute with diamond wire trenchers',
        status: 'mitigating'
      }
    ],
    location: {
      state: 'Uttar Pradesh',
      district: 'Jhansi & Lalitpur',
      city: 'Bundelkhand',
      coordinates: { lat: 25.4484, lng: 78.5685 },
      svgCoords: { x: 44, y: 41 }
    },
    recentUpdates: [
      {
        id: 'upd-02-1',
        projectId: 'proj-02',
        officerName: 'Er. Alok Srivastava',
        officerRole: 'Field Officer',
        timestamp: '2026-09-26 11:20',
        siteLocation: 'Mahoba WTP Site #3',
        reportedPhysicalProgress: 45.8,
        weatherCondition: 'Dry / 35°C',
        workforceCount: 140,
        machineryActive: 12,
        remarks: 'WTP clariflocculator civil slab cast. Contractor requesting early interim bill clearance to release pipe shipments.',
        photos: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'],
        verified: true,
        blockerFlagged: true,
        blockerDetails: 'Pipe shipment held at manufacturer yard due to delayed letter of credit.'
      }
    ],
    aiBrief: 'CRITICAL ALERT: Bundelkhand Water Grid is facing dual compounding risks: a 32.4% physical schedule slippage and severe contractor cash-flow gridlock. Without releasing an escrow-backed supplier payment model, the project will overshoot into FY2026 with ₹610 Cr overrun.'
  },
  {
    id: 'proj-03',
    code: 'MMRDA-2023-BRG-11',
    name: 'Mumbai Trans-Harbour Link (MTHL) Coastal Connector & Sea Spur',
    sector: 'Flyovers & Bridges',
    executingAgency: 'Mumbai Metropolitan Region Development Authority (MMRDA)',
    contractor: 'L&T - IHI Corporation Consortium',
    startDate: '2021-11-01',
    plannedCompletionDate: '2024-08-31',
    revisedCompletionDate: '2024-10-30',
    earlyWarningStatus: 'green',
    warningReasons: [
      'Project progressing smoothly within revised tolerances',
      'Safety and quality audits scoring above 94%',
      'Minor weather delay compensated by round-the-clock shift staffing'
    ],
    healthScore: 92,
    physicalProgress: {
      planned: 96.0,
      actual: 93.8,
      slippage: 2.2,
      trend: 'improving'
    },
    financials: {
      sanctionedBudgetCr: 4350,
      revisedBudgetCr: 4380,
      disbursedCr: 4100,
      utilizedExpenditureCr: 4050,
      unspentBalanceCr: 50,
      costOverrunAlert: false,
      costOverrunEstimateCr: 0,
      financialProgressPercent: 93.1,
      monthlyExpenditure: [
        { month: 'Oct 2025', plannedCr: 120, actualCr: 118 },
        { month: 'Nov 2025', plannedCr: 110, actualCr: 112 },
        { month: 'Dec 2025', plannedCr: 95, actualCr: 94 },
        { month: 'Jan 2026', plannedCr: 80, actualCr: 81 },
        { month: 'Feb 2026', plannedCr: 60, actualCr: 59 },
        { month: 'Mar 2026', plannedCr: 45, actualCr: 46 }
      ]
    },
    milestones: [
      {
        id: 'm-03-1',
        title: 'Deep Sea Orthotropic Steel Deck (OSD) Erection',
        category: 'Civil Works',
        plannedDate: '2023-12-15',
        actualDate: '2024-01-20',
        weightage: 40,
        progress: 100,
        status: 'completed',
        criticalPath: true,
        remarks: 'All 32 offshore mega spans successfully installed via crane barge'
      },
      {
        id: 'm-03-2',
        title: 'Mastic Asphalt Surfacing & Noise Barriers',
        category: 'Civil Works',
        plannedDate: '2024-06-30',
        actualDate: '2024-07-15',
        weightage: 25,
        progress: 100,
        status: 'completed',
        criticalPath: false,
        remarks: 'Special polymer waterproofing layer tested and cleared'
      },
      {
        id: 'm-03-3',
        title: 'Smart Highway Traffic Management System (HTMS)',
        category: 'Commissioning',
        plannedDate: '2024-08-31',
        actualDate: undefined,
        weightage: 20,
        progress: 88,
        status: 'in_progress',
        criticalPath: true,
        remarks: 'CCTV, incident detection cameras and automatic vehicle scanners calibration in final phase'
      },
      {
        id: 'm-03-4',
        title: 'Final Structural Load Testing & CRS Safety Certification',
        category: 'Inspection',
        plannedDate: '2024-10-15',
        actualDate: undefined,
        weightage: 15,
        progress: 60,
        status: 'in_progress',
        criticalPath: true,
        remarks: 'Static load deflection testing underway with 24 loaded multi-axle trucks'
      }
    ],
    risks: [
      {
        id: 'r-03-1',
        title: 'Post-Monsoon High Tidal Swells during Crane Calibration',
        category: 'Weather & Disaster',
        severity: 'low',
        impactCostCr: 5,
        impactDelayDays: 7,
        reportedDate: '2024-08-05',
        targetResolutionDate: '2026-10-01',
        assignedAuthority: 'Marine Works Superintendent',
        mitigationPlan: 'Utilize real-time Indian Navy hydrographic weather radar forecasts',
        status: 'mitigating'
      }
    ],
    location: {
      state: 'Maharashtra',
      district: 'Mumbai Suburban & Raigad',
      city: 'Navi Mumbai',
      coordinates: { lat: 18.9667, lng: 72.9333 },
      svgCoords: { x: 30, y: 58 }
    },
    recentUpdates: [
      {
        id: 'upd-03-1',
        projectId: 'proj-03',
        officerName: 'Er. Sachin Patil',
        officerRole: 'Senior Site Engineer',
        timestamp: '2026-09-27 18:15',
        siteLocation: 'Chirle Interchange Connector',
        reportedPhysicalProgress: 93.8,
        weatherCondition: 'Humid / 29°C',
        workforceCount: 420,
        machineryActive: 34,
        remarks: 'HTMS loop sensors installed across all 6 lanes. Final toll plaza canopy lighting completed.',
        photos: ['https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&auto=format&fit=crop&q=80'],
        verified: true,
        blockerFlagged: false
      }
    ],
    aiBrief: 'Excellent operational velocity. MTHL Coastal Connector is performing within optimal parameters (Slippage < 2.5%, Zero Cost Overrun). Recommended action: finalize Commissioner of Railway & Metro Safety clearance for prompt commissioning.'
  },
  {
    id: 'proj-04',
    code: 'BMRCL-2023-MTR-02',
    name: 'Bengaluru Outer Ring Road (ORR) Silkboard-KR Puram Metro Line 2A',
    sector: 'Urban Metro & Transit',
    executingAgency: 'Bangalore Metro Rail Corporation Ltd (BMRCL)',
    contractor: 'Afcons Infrastructure - Shankaranarayana JV',
    startDate: '2022-02-15',
    plannedCompletionDate: '2025-06-30',
    revisedCompletionDate: '2026-03-31',
    earlyWarningStatus: 'orange',
    warningReasons: [
      'Land acquisition impasse on 14 private tech-park entry gates along Bellandur stretch',
      'Physical slippage of 16.4% due to strict night-only traffic diversion windows',
      'Subcontractor steel rebars price escalation claim pending arbitration'
    ],
    healthScore: 59,
    physicalProgress: {
      planned: 68.0,
      actual: 51.6,
      slippage: 16.4,
      trend: 'declining'
    },
    financials: {
      sanctionedBudgetCr: 5800,
      revisedBudgetCr: 6240,
      disbursedCr: 3900,
      utilizedExpenditureCr: 3780,
      unspentBalanceCr: 120,
      costOverrunAlert: true,
      costOverrunEstimateCr: 440,
      financialProgressPercent: 65.1,
      monthlyExpenditure: [
        { month: 'Oct 2025', plannedCr: 150, actualCr: 120 },
        { month: 'Nov 2025', plannedCr: 160, actualCr: 130 },
        { month: 'Dec 2025', plannedCr: 175, actualCr: 140 },
        { month: 'Jan 2026', plannedCr: 190, actualCr: 155 },
        { month: 'Feb 2026', plannedCr: 210, actualCr: 165 },
        { month: 'Mar 2026', plannedCr: 220, actualCr: 170 }
      ]
    },
    milestones: [
      {
        id: 'm-04-1',
        title: 'Geotechnical Borehole Investigation & Utility Mapping',
        category: 'Clearance',
        plannedDate: '2022-09-30',
        actualDate: '2022-11-20',
        weightage: 15,
        progress: 100,
        status: 'completed',
        criticalPath: false,
        remarks: 'BWSSB water trunks and OFC cables tagged on GIS'
      },
      {
        id: 'm-04-2',
        title: 'Pier & Portal Beam Construction (740 Piers)',
        category: 'Civil Works',
        plannedDate: '2024-03-31',
        actualDate: undefined,
        weightage: 35,
        progress: 68,
        status: 'delayed',
        criticalPath: true,
        remarks: 'Only 11:00 PM to 5:00 AM traffic window allowed by Bengaluru Traffic Police'
      },
      {
        id: 'm-04-3',
        title: 'U-Girder Casting & Erection across Bellandur Flyover',
        category: 'Civil Works',
        plannedDate: '2024-12-15',
        actualDate: undefined,
        weightage: 30,
        progress: 42,
        status: 'delayed',
        criticalPath: true,
        remarks: 'Dual launcher deployment delayed due to space constraints'
      },
      {
        id: 'm-04-4',
        title: 'Station Concourse Structural Framing (13 Stations)',
        category: 'Civil Works',
        plannedDate: '2025-03-31',
        actualDate: undefined,
        weightage: 20,
        progress: 25,
        status: 'delayed',
        criticalPath: true,
        remarks: 'Land handover delayed at Kadubeesanahalli station'
      }
    ],
    risks: [
      {
        id: 'r-04-1',
        title: 'Night Traffic Police Permitting Constraint Along ORR Tech Corridor',
        category: 'Legal Dispute',
        severity: 'high',
        impactCostCr: 140,
        impactDelayDays: 90,
        reportedDate: '2023-09-12',
        targetResolutionDate: '2026-10-20',
        assignedAuthority: 'Joint Commissioner of Traffic Police & BMRCL Director',
        mitigationPlan: 'Implement weekend full-lane barricading protocol with feeder road diversions',
        status: 'mitigating'
      },
      {
        id: 'r-04-2',
        title: 'Right-of-Way (ROW) Land Litigation with Tech Park Developers',
        category: 'Land Acquisition',
        severity: 'critical',
        impactCostCr: 210,
        impactDelayDays: 120,
        reportedDate: '2023-11-05',
        targetResolutionDate: '2026-10-15',
        assignedAuthority: 'Special Land Acquisition Officer, KIADB',
        mitigationPlan: 'Offer Transferable Development Rights (TDR) incentives and direct pedestrian skywalk connectivity',
        status: 'escalated_to_pmo'
      }
    ],
    location: {
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      city: 'Bengaluru',
      coordinates: { lat: 12.9249, lng: 77.6748 },
      svgCoords: { x: 38, y: 78 }
    },
    recentUpdates: [
      {
        id: 'upd-04-1',
        projectId: 'proj-04',
        officerName: 'Er. Naveen Gowda',
        officerRole: 'Field Officer',
        timestamp: '2026-09-27 04:30',
        siteLocation: 'Kadubeesanahalli Pier #284',
        reportedPhysicalProgress: 51.6,
        weatherCondition: 'Clear / 22°C',
        workforceCount: 260,
        machineryActive: 19,
        remarks: 'Night erection of 28m U-girder span completed before morning IT rush hour opening. No incidents.',
        photos: ['https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=600&auto=format&fit=crop&q=80'],
        verified: true,
        blockerFlagged: false
      }
    ],
    aiBrief: 'Bengaluru ORR Metro 2A has slipped by 16.4% due to acute urban congestion windows and station land acquisition disputes. Recommendation: Institute daily coordination desk between BMRCL, Traffic Police, and BBMP to grant 2-hour daylight staging buffers on weekends.'
  },
  {
    id: 'proj-05',
    code: 'NMCG-2023-STP-19',
    name: 'Ganga Riverfront Interceptor Sewerage & STPs Network (Phase II)',
    sector: 'Water Supply & Grids',
    executingAgency: 'National Mission for Clean Ganga (NMCG) / Bihar Urban Infrastructure (BUIDCO)',
    contractor: 'VA Tech Wabag - Triveni Engineering JV',
    startDate: '2022-10-01',
    plannedCompletionDate: '2025-03-31',
    revisedCompletionDate: '2025-08-31',
    earlyWarningStatus: 'yellow',
    warningReasons: [
      'Physical progress slippage of 8.2% caused by prolonged post-monsoon river inundation',
      'Power substations hookup approval pending with State Electricity Board',
      'Minor tariff restructuring discussion between state and concessionaire'
    ],
    healthScore: 74,
    physicalProgress: {
      planned: 65.4,
      actual: 57.2,
      slippage: 8.2,
      trend: 'stable'
    },
    financials: {
      sanctionedBudgetCr: 2100,
      revisedBudgetCr: 2160,
      disbursedCr: 1520,
      utilizedExpenditureCr: 1470,
      unspentBalanceCr: 50,
      costOverrunAlert: false,
      costOverrunEstimateCr: 60,
      financialProgressPercent: 70.0,
      monthlyExpenditure: [
        { month: 'Oct 2025', plannedCr: 60, actualCr: 54 },
        { month: 'Nov 2025', plannedCr: 65, actualCr: 61 },
        { month: 'Dec 2025', plannedCr: 70, actualCr: 68 },
        { month: 'Jan 2026', plannedCr: 75, actualCr: 72 },
        { month: 'Feb 2026', plannedCr: 80, actualCr: 76 },
        { month: 'Mar 2026', plannedCr: 85, actualCr: 81 }
      ]
    },
    milestones: [
      {
        id: 'm-05-1',
        title: 'Trenchless Micro-tunneling for 68 km Interceptor Trunk',
        category: 'Civil Works',
        plannedDate: '2024-02-28',
        actualDate: '2024-05-15',
        weightage: 35,
        progress: 82,
        status: 'in_progress',
        criticalPath: true,
        remarks: '6 Slurry TBMs operating in riverfront alluvial soil'
      },
      {
        id: 'm-05-2',
        title: '140 MLD Sewage Treatment Plant Civil Construction (Digha)',
        category: 'Civil Works',
        plannedDate: '2024-10-31',
        actualDate: undefined,
        weightage: 35,
        progress: 64,
        status: 'in_progress',
        criticalPath: true,
        remarks: 'Sequential Batch Reactor (SBR) aeration basin walls concrete pour ongoing'
      },
      {
        id: 'm-05-3',
        title: 'SCADA Online Water Quality Monitoring & Telemetry Systems',
        category: 'Commissioning',
        plannedDate: '2025-02-28',
        actualDate: undefined,
        weightage: 30,
        progress: 25,
        status: 'pending',
        criticalPath: false,
        remarks: 'Sensors imported; awaiting civil finishing'
      }
    ],
    risks: [
      {
        id: 'r-05-1',
        title: 'High Silt Deposition in Outfall Channels Post Flooding',
        category: 'Weather & Disaster',
        severity: 'medium',
        impactCostCr: 22,
        impactDelayDays: 30,
        reportedDate: '2024-08-20',
        targetResolutionDate: '2026-10-15',
        assignedAuthority: 'BUIDCO Chief Engineer',
        mitigationPlan: 'Mobilize cutter-suction dredging rigs before dry season works',
        status: 'mitigating'
      }
    ],
    location: {
      state: 'Bihar',
      district: 'Patna',
      city: 'Patna',
      coordinates: { lat: 25.5941, lng: 85.1376 },
      svgCoords: { x: 62, y: 39 }
    },
    recentUpdates: [
      {
        id: 'upd-05-1',
        projectId: 'proj-05',
        officerName: 'Er. Rakesh Ranjan',
        officerRole: 'Field Officer',
        timestamp: '2026-09-27 15:00',
        siteLocation: 'Digha Ghat Main STP Site',
        reportedPhysicalProgress: 57.2,
        weatherCondition: 'Sunny / 31°C',
        workforceCount: 195,
        machineryActive: 16,
        remarks: 'Secondary clarifier base slab inspection passed QA audit. Sludge digester tanks shuttering underway.',
        photos: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'],
        verified: true,
        blockerFlagged: false
      }
    ],
    aiBrief: 'Yellow Attention: Moderate delay of 8.2% primarily related to natural river high-water cycles. Substructure works are structurally sound. Priority: expedite Bihar State Power Holding grid interconnect permit.'
  },
  {
    id: 'proj-06',
    code: 'MPRDC-2023-EXP-04',
    name: 'Bhopal-Indore High-Speed Economic Logistics Expressway (6-Laning)',
    sector: 'Highways & Expressways',
    executingAgency: 'M.P. Road Development Corporation (MPRDC)',
    contractor: 'Dilip Buildcon Limited',
    startDate: '2023-01-10',
    plannedCompletionDate: '2025-12-31',
    revisedCompletionDate: '2025-12-31',
    earlyWarningStatus: 'green',
    warningReasons: [
      'Project is on track and ahead of revised schedule milestones',
      'Fast-track mechanized slip-form concrete paving achieving 2.8 km/day rate',
      'All forest and environmental permits in place'
    ],
    healthScore: 95,
    physicalProgress: {
      planned: 52.0,
      actual: 54.8,
      slippage: -2.8, // negative means ahead!
      trend: 'improving'
    },
    financials: {
      sanctionedBudgetCr: 3400,
      revisedBudgetCr: 3400,
      disbursedCr: 2100,
      utilizedExpenditureCr: 2020,
      unspentBalanceCr: 80,
      costOverrunAlert: false,
      costOverrunEstimateCr: 0,
      financialProgressPercent: 59.4,
      monthlyExpenditure: [
        { month: 'Oct 2025', plannedCr: 95, actualCr: 102 },
        { month: 'Nov 2025', plannedCr: 105, actualCr: 110 },
        { month: 'Dec 2025', plannedCr: 110, actualCr: 115 },
        { month: 'Jan 2026', plannedCr: 120, actualCr: 128 },
        { month: 'Feb 2026', plannedCr: 130, actualCr: 135 },
        { month: 'Mar 2026', plannedCr: 140, actualCr: 144 }
      ]
    },
    milestones: [
      {
        id: 'm-06-1',
        title: '100% Right-of-Way (ROW) Possession & Tree Felling Clearances',
        category: 'Clearance',
        plannedDate: '2023-06-30',
        actualDate: '2023-05-15',
        weightage: 20,
        progress: 100,
        status: 'completed',
        criticalPath: true,
        remarks: 'Direct compensation disbursal via Aadhaar DBT completed'
      },
      {
        id: 'm-06-2',
        title: 'Pavement Quality Concrete (PQC) Main Carriageway (120 km)',
        category: 'Civil Works',
        plannedDate: '2024-12-31',
        actualDate: undefined,
        weightage: 45,
        progress: 68,
        status: 'in_progress',
        criticalPath: true,
        remarks: 'Wirtgen SP 1600 paver achieving record daily outputs'
      },
      {
        id: 'm-06-3',
        title: 'Interchanges at Sehore, Ashta & Dewas Bypass',
        category: 'Civil Works',
        plannedDate: '2025-06-30',
        actualDate: undefined,
        weightage: 35,
        progress: 40,
        status: 'in_progress',
        criticalPath: false,
        remarks: 'Flyover girder launching completed at Ashta'
      }
    ],
    risks: [
      {
        id: 'r-06-1',
        title: 'Fly Ash Procurement Shortage from Regional Thermal Plants',
        category: 'Utility Shifting',
        severity: 'low',
        impactCostCr: 15,
        impactDelayDays: 10,
        reportedDate: '2024-05-18',
        targetResolutionDate: '2026-10-05',
        assignedAuthority: 'MP Power Generating Co. Liaison Officer',
        mitigationPlan: 'Signed long-term agreement with Sarni Thermal Power Station',
        status: 'resolved'
      }
    ],
    location: {
      state: 'Madhya Pradesh',
      district: 'Sehore & Dewas',
      city: 'Bhopal-Indore',
      coordinates: { lat: 23.2599, lng: 77.4126 },
      svgCoords: { x: 42, y: 50 }
    },
    recentUpdates: [
      {
        id: 'upd-06-1',
        projectId: 'proj-06',
        officerName: 'Er. Vikas Sharma',
        officerRole: 'Field Officer',
        timestamp: '2026-09-27 12:45',
        siteLocation: 'Km 64+200 Ashta Section',
        reportedPhysicalProgress: 54.8,
        weatherCondition: 'Sunny / 30°C',
        workforceCount: 520,
        machineryActive: 46,
        remarks: 'Slip-form PQC paving completed on Chainage 60 to 64. Core samples compression test passed with 48 MPa strength.',
        photos: ['https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=600&auto=format&fit=crop&q=80'],
        verified: true,
        blockerFlagged: false
      }
    ],
    aiBrief: 'Star performer project: Running 2.8% ahead of schedule with 0% cost overrun. The mechanized pavement approach and zero-ROW hindrance are exemplary models for national corridor replication.'
  },
  {
    id: 'proj-07',
    code: 'COCH-2023-PRT-05',
    name: 'Kochi Smart Maritime Port Multimodal Ro-Ro & Cargo Terminal',
    sector: 'Port & Energy Logistics',
    executingAgency: 'Cochin Port Authority / Ministry of Ports, Shipping & Waterways',
    contractor: 'Adani Ports & Special Economic Zone (APSEZ) - Boskalis JV',
    startDate: '2023-03-01',
    plannedCompletionDate: '2025-09-30',
    revisedCompletionDate: '2025-12-31',
    earlyWarningStatus: 'yellow',
    warningReasons: [
      'Coastal Regulation Zone (CRZ) clearance amendment pending for breakwater extension',
      'Physical progress slippage of 7.4% during active southwest monsoon wave action',
      'Naval hydrographic survey team requested safe navigational corridor adjustments'
    ],
    healthScore: 76,
    physicalProgress: {
      planned: 56.4,
      actual: 49.0,
      slippage: 7.4,
      trend: 'stable'
    },
    financials: {
      sanctionedBudgetCr: 1850,
      revisedBudgetCr: 1890,
      disbursedCr: 1200,
      utilizedExpenditureCr: 1140,
      unspentBalanceCr: 60,
      costOverrunAlert: false,
      costOverrunEstimateCr: 40,
      financialProgressPercent: 61.6,
      monthlyExpenditure: [
        { month: 'Oct 2025', plannedCr: 48, actualCr: 42 },
        { month: 'Nov 2025', plannedCr: 52, actualCr: 47 },
        { month: 'Dec 2025', plannedCr: 55, actualCr: 51 },
        { month: 'Jan 2026', plannedCr: 60, actualCr: 58 },
        { month: 'Feb 2026', plannedCr: 65, actualCr: 62 },
        { month: 'Mar 2026', plannedCr: 70, actualCr: 66 }
      ]
    },
    milestones: [
      {
        id: 'm-07-1',
        title: 'Capital Dredging of 14.5m Draft Navigation Channel',
        category: 'Civil Works',
        plannedDate: '2024-04-30',
        actualDate: '2024-06-15',
        weightage: 35,
        progress: 85,
        status: 'in_progress',
        criticalPath: true,
        remarks: 'Trailing suction hopper dredger removing 4.2 million cu.m silt'
      },
      {
        id: 'm-07-2',
        title: 'Berth Quay Wall & Marine Pile Caps (450m Quay)',
        category: 'Civil Works',
        plannedDate: '2024-11-30',
        actualDate: undefined,
        weightage: 35,
        progress: 48,
        status: 'in_progress',
        criticalPath: true,
        remarks: 'Prestressed concrete piles driven into bedrock'
      },
      {
        id: 'm-07-3',
        title: 'Automated Container Stacking Cranes (e-RTG) Installation',
        category: 'Procurement',
        plannedDate: '2025-06-30',
        actualDate: undefined,
        weightage: 30,
        progress: 15,
        status: 'pending',
        criticalPath: false,
        remarks: 'Cranes dispatched from manufacturing facility'
      }
    ],
    risks: [
      {
        id: 'r-07-1',
        title: 'National Green Tribunal (NGT) Local Fisherman Welfare Petition',
        category: 'Legal Dispute',
        severity: 'medium',
        impactCostCr: 30,
        impactDelayDays: 45,
        reportedDate: '2024-04-12',
        targetResolutionDate: '2026-10-18',
        assignedAuthority: 'District Collector Ernakulam & Port Trust Chairman',
        mitigationPlan: 'Established dedicated ₹18 Cr fisheries alternative jetty and compensation trust',
        status: 'mitigating'
      }
    ],
    location: {
      state: 'Kerala',
      district: 'Ernakulam',
      city: 'Kochi',
      coordinates: { lat: 9.9312, lng: 76.2673 },
      svgCoords: { x: 33, y: 86 }
    },
    recentUpdates: [
      {
        id: 'upd-07-1',
        projectId: 'proj-07',
        officerName: 'Er. George Thomas',
        officerRole: 'Field Officer',
        timestamp: '2026-09-27 10:00',
        siteLocation: 'South Breakwater Extension Point',
        reportedPhysicalProgress: 49.0,
        weatherCondition: 'Overcast / 28°C',
        workforceCount: 210,
        machineryActive: 14,
        remarks: 'Armor rock placement on breakwater seawall reached 320m. Marine barge safely anchored.',
        photos: ['https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80'],
        verified: true,
        blockerFlagged: false
      }
    ],
    aiBrief: 'Yellow Attention: Moderate weather slippage of 7.4% is manageable with pre-dredging pace. Critical milestone: ensure clearance from MoEF&CC Expert Appraisal Committee before winter dredging window closes.'
  },
  {
    id: 'proj-08',
    code: 'TNHAI-2023-FLY-09',
    name: 'Chennai Coastal Elevated Bypass & Sea Wall Protection Viaduct',
    sector: 'Flyovers & Bridges',
    executingAgency: 'Tamil Nadu Highways & Minor Ports Department',
    contractor: 'Simplex Infrastructures - Coastal Projects JV',
    startDate: '2022-05-15',
    plannedCompletionDate: '2024-10-31',
    revisedCompletionDate: '2025-11-30',
    earlyWarningStatus: 'red',
    warningReasons: [
      'Physical progress slippage is 28.5% with near-complete halt on 3 marine sections',
      'Contractor invoked force majeure citing severe coastal tidal erosion and steel rate escalation',
      'Cost overrun forecast at ₹490 Cr (+15.5% over sanctioned budget)',
      'Sub-contractor labor strike unresolved for 38 days'
    ],
    healthScore: 34,
    physicalProgress: {
      planned: 72.5,
      actual: 44.0,
      slippage: 28.5,
      trend: 'declining'
    },
    financials: {
      sanctionedBudgetCr: 3150,
      revisedBudgetCr: 3640,
      disbursedCr: 2100,
      utilizedExpenditureCr: 1980,
      unspentBalanceCr: 120,
      costOverrunAlert: true,
      costOverrunEstimateCr: 490,
      financialProgressPercent: 54.4,
      monthlyExpenditure: [
        { month: 'Oct 2025', plannedCr: 90, actualCr: 32 },
        { month: 'Nov 2025', plannedCr: 100, actualCr: 38 },
        { month: 'Dec 2025', plannedCr: 110, actualCr: 41 },
        { month: 'Jan 2026', plannedCr: 120, actualCr: 45 },
        { month: 'Feb 2026', plannedCr: 130, actualCr: 48 },
        { month: 'Mar 2026', plannedCr: 140, actualCr: 50 }
      ]
    },
    milestones: [
      {
        id: 'm-08-1',
        title: 'Offshore Caisson Foundations & Scour Protection Armour',
        category: 'Civil Works',
        plannedDate: '2023-09-30',
        actualDate: '2024-03-15',
        weightage: 30,
        progress: 75,
        status: 'delayed',
        criticalPath: true,
        remarks: 'Severe scour erosion detected near Ennore creek requiring geo-tubes'
      },
      {
        id: 'm-08-2',
        title: 'Cast-in-situ Balanced Cantilever Superstructure',
        category: 'Civil Works',
        plannedDate: '2024-06-30',
        actualDate: undefined,
        weightage: 40,
        progress: 35,
        status: 'delayed',
        criticalPath: true,
        remarks: 'Contractor staging machinery impounded by sub-contractor lien'
      },
      {
        id: 'm-08-3',
        title: 'Tetrapod Sea Wall & Armoured Breakwater Berm (6.2 km)',
        category: 'Civil Works',
        plannedDate: '2024-10-31',
        actualDate: undefined,
        weightage: 30,
        progress: 28,
        status: 'delayed',
        criticalPath: true,
        remarks: 'Quarrying stone supply hit by environmental permit revocation in Chengalpattu'
      }
    ],
    risks: [
      {
        id: 'r-08-1',
        title: 'Contractor Financial Default & Threat of Contract Termination',
        category: 'Contractor Liquidity',
        severity: 'critical',
        impactCostCr: 380,
        impactDelayDays: 180,
        reportedDate: '2024-02-28',
        targetResolutionDate: '2026-10-08',
        assignedAuthority: 'Secretary, Highways Department Tamil Nadu',
        mitigationPlan: 'Issue 14-day cure notice, explore substituting with NHAI PSU executing partner',
        status: 'escalated_to_pmo'
      },
      {
        id: 'r-08-2',
        title: 'Ennore Creek Ecological Impact & Fisherman High Court Injunction',
        category: 'Environmental Clearance',
        severity: 'critical',
        impactCostCr: 110,
        impactDelayDays: 90,
        reportedDate: '2024-04-05',
        targetResolutionDate: '2026-10-22',
        assignedAuthority: 'Advocate General & Environment Secretary',
        mitigationPlan: 'Present revised eco-restoration and mangrove replantation scheme to Madras HC',
        status: 'open'
      }
    ],
    location: {
      state: 'Tamil Nadu',
      district: 'Chennai',
      city: 'Chennai',
      coordinates: { lat: 13.0827, lng: 80.2707 },
      svgCoords: { x: 48, y: 77 }
    },
    recentUpdates: [
      {
        id: 'upd-08-1',
        projectId: 'proj-08',
        officerName: 'Er. S. Murugesan',
        officerRole: 'Field Officer',
        timestamp: '2026-09-26 14:10',
        siteLocation: 'Ennore Expressway Pier #112',
        reportedPhysicalProgress: 44.0,
        weatherCondition: 'Cloudy / 31°C',
        workforceCount: 65,
        machineryActive: 6,
        remarks: 'Severe site slowdown. Only 65 workers reported on site due to delayed payroll from main contractor.',
        photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'],
        verified: true,
        blockerFlagged: true,
        blockerDetails: 'Labor attendance collapsed to 15% of contracted strength.'
      }
    ],
    aiBrief: 'CRITICAL ESCALATION: Chennai Coastal Bypass has stalled into red danger zone (28.5% slippage, ₹490 Cr overrun estimate). Recommended immediate PMO/Secretary action: issue statutory 14-day default cure notice or invoke risk-and-cost contract termination.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    projectId: 'proj-02',
    projectCode: 'JJM-2023-WTR-42',
    projectName: 'Bundelkhand Multi-Village Rural Water Grid',
    type: 'critical_delay',
    title: 'RED ALERT: 32.4% Progress Slippage Detected',
    message: 'Contractor working capital distress has halted WTP installations in 4 blocks. Estimated cost overrun is now ₹610 Cr.',
    timestamp: '12 mins ago',
    severity: 'red',
    read: false
  },
  {
    id: 'notif-02',
    projectId: 'proj-08',
    projectCode: 'TNHAI-2023-FLY-09',
    projectName: 'Chennai Coastal Elevated Bypass',
    type: 'high_risk',
    title: 'CRITICAL RISK: Labor Attendance Collapse to 15%',
    message: 'Site Superintending Engineer reported workforce dropped to 65 personnel. Statutory 14-day notice recommended.',
    timestamp: '45 mins ago',
    severity: 'red',
    read: false
  },
  {
    id: 'notif-03',
    projectId: 'proj-01',
    projectCode: 'NHAI-2024-EXP-08',
    projectName: 'Dwarka Expressway Package 3',
    type: 'milestone_breach',
    title: 'ORANGE WARNING: 66kV Utility Shifting Delayed 115 Days',
    message: 'Segment launcher blocked at Bajghera crossing. High-level HVPNL clearance meeting required.',
    timestamp: '2 hours ago',
    severity: 'orange',
    read: false
  },
  {
    id: 'notif-04',
    projectId: 'proj-04',
    projectCode: 'BMRCL-2023-MTR-02',
    projectName: 'Bengaluru ORR Metro Line 2A',
    type: 'cost_overrun',
    title: 'ORANGE WARNING: Budget Escalation Forecast ₹440 Cr',
    message: 'Night traffic restrictions and Bellandur ROW litigation pushing project target past March 2026.',
    timestamp: '4 hours ago',
    severity: 'orange',
    read: false
  },
  {
    id: 'notif-05',
    projectId: 'proj-06',
    projectCode: 'MPRDC-2023-EXP-04',
    projectName: 'Bhopal-Indore High-Speed Expressway',
    type: 'field_alert',
    title: 'GREEN MILESTONE: PQC Paving Running Ahead of Schedule',
    message: 'Concrete paving achieved 2.8 km/day record pace. Physical progress at 54.8% vs 52.0% planned.',
    timestamp: '6 hours ago',
    severity: 'green',
    read: true
  }
];
