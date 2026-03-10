import { create } from "zustand";
import { Employee, BenefitRequest, AuditLog, sampleEmployees, sampleRequests, sampleAuditLogs } from "./data";

interface AppState {
  // Current user
  currentUser: Employee | null;
  setCurrentUser: (user: Employee | null) => void;
  
  // View mode
  viewMode: "employee" | "hr_admin";
  setViewMode: (mode: "employee" | "hr_admin") => void;
  
  // Employees (for HR view)
  employees: Employee[];
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  
  // Benefit requests
  requests: BenefitRequest[];
  addRequest: (request: BenefitRequest) => void;
  updateRequest: (id: string, updates: Partial<BenefitRequest>) => void;
  
  // Audit logs
  auditLogs: AuditLog[];
  addAuditLog: (log: AuditLog) => void;
  
  // UI state
  selectedBenefitId: string | null;
  setSelectedBenefitId: (id: string | null) => void;
  
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  
  showContractModal: boolean;
  setShowContractModal: (show: boolean) => void;
  
  contractBenefitId: string | null;
  setContractBenefitId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Current user - default to first employee
  currentUser: sampleEmployees[0],
  setCurrentUser: (user) => set({ currentUser: user }),
  
  // View mode
  viewMode: "employee",
  setViewMode: (mode) => set({ viewMode: mode }),
  
  // Employees
  employees: sampleEmployees,
  updateEmployee: (id, updates) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, ...updates } : emp
      ),
      currentUser:
        state.currentUser?.id === id
          ? { ...state.currentUser, ...updates }
          : state.currentUser,
    })),
  
  // Requests
  requests: sampleRequests,
  addRequest: (request) =>
    set((state) => ({
      requests: [...state.requests, request],
    })),
  updateRequest: (id, updates) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, ...updates } : req
      ),
    })),
  
  // Audit logs
  auditLogs: sampleAuditLogs,
  addAuditLog: (log) =>
    set((state) => ({
      auditLogs: [log, ...state.auditLogs],
    })),
  
  // UI state
  selectedBenefitId: null,
  setSelectedBenefitId: (id) => set({ selectedBenefitId: id }),
  
  selectedEmployeeId: null,
  setSelectedEmployeeId: (id) => set({ selectedEmployeeId: id }),
  
  showContractModal: false,
  setShowContractModal: (show) => set({ showContractModal: show }),
  
  contractBenefitId: null,
  setContractBenefitId: (id) => set({ contractBenefitId: id }),
}));
