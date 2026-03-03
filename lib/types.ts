export type IntakeSource = "1342" | "ONLINE" | "WALKIN" | "AGENCY";

export type Triage = "LOW" | "MID" | "HIGH" | "EMERG";
export type CaseStatus = "NEW" | "IN_PROGRESS" | "MONITORING" | "CLOSED";

export type Intake = {
  id: string;
  createdAt: string;        // ISO
  source: IntakeSource;
  region: string;
  triage: Triage;
  consent: boolean;
  summary: string;
  preferredCenter?: string;
  assignedCenter?: string;
  convertedCaseId?: string;
};

export type CaseEvent = {
  at: string;
  type: "INTAKE" | "ASSESSMENT" | "ISP" | "INTERVENTION" | "REFERRAL" | "MONITORING" | "CLOSE";
  title: string;
  note?: string;
};

export type CaseTask = {
  id: string;
  title: string;
  dueAt?: string;
  status: "TODO" | "DOING" | "DONE";
};

export type ISPGoal = {
  id: string;
  horizon: "SHORT" | "MID" | "LONG";
  goal: string;
  metric?: string;
  due?: string;
};

export type ISPIntervention = {
  id: string;
  category: "COUNSELING" | "PROGRAM" | "MEDICAL" | "MHIS" | "LEGAL" | "WELFARE" | "FAMILY";
  action: string;
  owner?: string;
  schedule?: string;
};

export type ISPPlan = {
  caseId: string;
  version: number;
  problems: string[];
  goals: ISPGoal[];
  interventions: ISPIntervention[];
  reviewCycle: "WEEKLY" | "MONTHLY" | "QUARTERLY";
  crisisPlan: string;
  updatedAt: string;
};

export type Case = {
  id: string;
  subjectLabel: string;   // 가명(예: CASE-000123)
  region: string;
  status: CaseStatus;
  triage: Triage;
  createdAt: string;
  lastUpdatedAt: string;
  intakeId: string;
  events: CaseEvent[];
  tasks: CaseTask[];
  isp?: ISPPlan;
};

export type Subject = {
  id: string;
  caseNo: string;           // 관리번호 (SUBJ-000123)
  alias: string;            // 가명
  gender: "M" | "F";
  birthYear: number;
  region: string;
  drugTypes: string[];      // 마약 유형
  entryRoute: "1342" | "LEGAL" | "SELF" | "AGENCY";
  registeredAt: string;
  status: "ACTIVE" | "MONITORING" | "CLOSED";
};

export type Center = {
  id: string;
  name: string;
  region: string;
  address: string;
  phone: string;
  manager: string;
  capacity: number;
  activeCases: number;
};

export type SystemUser = {
  id: string;
  name: string;
  centerId: string;
  centerName: string;
  role: "ADMIN" | "MANAGER" | "COUNSELOR" | "VIEWER";
  email: string;
  active: boolean;
  lastLoginAt?: string;
};

export type Resource = {
  id: string;
  name: string;
  type: "MEDICAL" | "WELFARE" | "LEGAL" | "EMPLOYMENT" | "SELF_HELP";
  region: string;
  phone: string;
  address: string;
  note?: string;
};

export type IntegrationConnector = {
  id: string;
  name: string;
  group: "EA" | "ADMIN";
  status: "OK" | "DEGRADED" | "DOWN";
  lastSyncAt?: string;
};

export type IntegrationLog = {
  id: string;
  at: string;
  connectorId: string;
  direction: "OUT" | "IN";
  message: string;
  result: "SUCCESS" | "FAIL";
};
