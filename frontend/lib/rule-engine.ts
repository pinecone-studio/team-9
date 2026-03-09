import { Employee, Benefit, RuleEvaluation, BenefitStatus, EmployeeBenefit, benefits, sampleRequests } from "./data";

// Calculate tenure in days
function getTenureDays(hireDate: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - hireDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Rule evaluators
type RuleEvaluator = (employee: Employee, benefit: Benefit) => RuleEvaluation;

const evaluateProbationRule: RuleEvaluator = (employee, benefit) => {
  // Core benefits and Shit Happened Days are available during probation
  if (benefit.is_core || benefit.id === "shit-happened") {
    return {
      rule_name: "Probation Status",
      passed: true,
      explanation: "This benefit is available during probation period",
    };
  }

  const passed = employee.employment_status !== "probation";
  return {
    rule_name: "Probation Status",
    passed,
    explanation: passed
      ? "Employee has completed probation period"
      : "Available after completing probation period",
  };
};

const evaluateOKRRule: RuleEvaluator = (employee, benefit) => {
  // Core benefits don't require OKR submission
  if (benefit.is_core) {
    return {
      rule_name: "OKR Submission",
      passed: true,
      explanation: "Core benefit - OKR submission not required",
    };
  }

  return {
    rule_name: "OKR Submission",
    passed: employee.okr_submitted,
    explanation: employee.okr_submitted
      ? "OKR submitted for current quarter"
      : "OKR not submitted for current quarter",
  };
};

const evaluateAttendanceRule: RuleEvaluator = (employee, benefit) => {
  // Only certain benefits are affected by attendance
  const attendanceAffectedBenefits = ["gym", "insurance", "remote-work", "okr-bonus"];
  
  if (!attendanceAffectedBenefits.includes(benefit.id)) {
    return {
      rule_name: "Attendance",
      passed: true,
      explanation: "Not affected by attendance rules",
    };
  }

  const threshold = 3;
  const passed = employee.late_arrival_count < threshold;
  
  return {
    rule_name: "Attendance",
    passed,
    explanation: passed
      ? `${employee.late_arrival_count} late arrivals (threshold: ${threshold})`
      : `${employee.late_arrival_count} late arrivals exceeds threshold of ${threshold}`,
  };
};

const evaluateResponsibilityLevelRule: RuleEvaluator = (employee, benefit) => {
  const levelRequirements: Record<string, number> = {
    "extra-responsibility": 2,
    "down-payment": 2,
  };

  const requiredLevel = levelRequirements[benefit.id];
  
  if (!requiredLevel) {
    return {
      rule_name: "Responsibility Level",
      passed: true,
      explanation: "No responsibility level requirement",
    };
  }

  const passed = employee.responsibility_level >= requiredLevel;
  const levelNames = ["", "Standard", "Senior", "Lead/Manager"];
  
  return {
    rule_name: "Responsibility Level",
    passed,
    explanation: passed
      ? `Level ${employee.responsibility_level} (${levelNames[employee.responsibility_level]}) meets requirement`
      : `Requires level ${requiredLevel} (${levelNames[requiredLevel]}) or higher`,
  };
};

const evaluateRoleRule: RuleEvaluator = (employee, benefit) => {
  if (benefit.id === "ux-tools") {
    const passed = employee.role === "ux_engineer";
    return {
      rule_name: "Role Requirement",
      passed,
      explanation: passed
        ? "UX Engineer role verified"
        : "Only available for UX Engineer role",
    };
  }

  return {
    rule_name: "Role Requirement",
    passed: true,
    explanation: "Available for all roles",
  };
};

const evaluateTenureRule: RuleEvaluator = (employee, benefit) => {
  const tenureRequirements: Record<string, { days: number; label: string }> = {
    "macbook": { days: 180, label: "6 months" },
    "travel": { days: 365, label: "12 months" },
    "down-payment": { days: 730, label: "24 months" },
  };

  const requirement = tenureRequirements[benefit.id];
  
  if (!requirement) {
    return {
      rule_name: "Tenure",
      passed: true,
      explanation: "No tenure requirement",
    };
  }

  const tenureDays = getTenureDays(employee.hire_date);
  const passed = tenureDays >= requirement.days;
  
  return {
    rule_name: "Tenure",
    passed,
    explanation: passed
      ? `${Math.floor(tenureDays / 30)} months of employment meets requirement`
      : `Available after ${requirement.label} of employment (currently ${Math.floor(tenureDays / 30)} months)`,
  };
};

// Main eligibility evaluation
export function evaluateBenefitEligibility(
  employee: Employee,
  benefit: Benefit
): EmployeeBenefit {
  const rules: RuleEvaluator[] = [
    evaluateProbationRule,
    evaluateOKRRule,
    evaluateAttendanceRule,
    evaluateResponsibilityLevelRule,
    evaluateRoleRule,
    evaluateTenureRule,
  ];

  const ruleEvaluations = rules.map((rule) => rule(employee, benefit));
  
  // Check if there's an active request
  const pendingRequest = sampleRequests.find(
    (r) => r.employee_id === employee.id && r.benefit_id === benefit.id && r.status === "pending"
  );
  
  const approvedRequest = sampleRequests.find(
    (r) => r.employee_id === employee.id && r.benefit_id === benefit.id && r.status === "approved"
  );

  // Determine status
  let status: BenefitStatus;
  let lockedReason: string | undefined;

  if (approvedRequest) {
    status = "ACTIVE";
  } else if (pendingRequest) {
    status = "PENDING";
  } else {
    const allPassed = ruleEvaluations.every((r) => r.passed);
    
    if (allPassed) {
      status = "ELIGIBLE";
    } else {
      status = "LOCKED";
      const failedRules = ruleEvaluations.filter((r) => !r.passed);
      lockedReason = failedRules.map((r) => r.explanation).join("; ");
    }
  }

  return {
    benefit_id: benefit.id,
    employee_id: employee.id,
    status,
    rule_evaluations: ruleEvaluations,
    locked_reason: lockedReason,
  };
}

// Get all benefits with eligibility for an employee
export function getEmployeeBenefits(employee: Employee): (Benefit & { eligibility: EmployeeBenefit })[] {
  return benefits.map((benefit) => ({
    ...benefit,
    eligibility: evaluateBenefitEligibility(employee, benefit),
  }));
}

// Get benefits grouped by category
export function getBenefitsByCategory(employee: Employee) {
  const employeeBenefits = getEmployeeBenefits(employee);
  const categories: Record<string, (Benefit & { eligibility: EmployeeBenefit })[]> = {};

  employeeBenefits.forEach((benefit) => {
    if (!categories[benefit.category]) {
      categories[benefit.category] = [];
    }
    categories[benefit.category].push(benefit);
  });

  return categories;
}

// Get summary stats
export function getBenefitStats(employee: Employee) {
  const employeeBenefits = getEmployeeBenefits(employee);
  
  return {
    total: employeeBenefits.length,
    active: employeeBenefits.filter((b) => b.eligibility.status === "ACTIVE").length,
    eligible: employeeBenefits.filter((b) => b.eligibility.status === "ELIGIBLE").length,
    locked: employeeBenefits.filter((b) => b.eligibility.status === "LOCKED").length,
    pending: employeeBenefits.filter((b) => b.eligibility.status === "PENDING").length,
  };
}
