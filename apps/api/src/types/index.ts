export type EmploymentStatus =
  | "active"
  | "probation"
  | "leave"
  | "terminated"

export type Operator =
  | "eq"
  | "neq"
  | "gte"
  | "lte"
  | "gt"
  | "lt"
  | "in"
  | "not_in"

export type RuleType =
  | "employment_status"
  | "okr_submitted"
  | "attendance"
  | "responsibility_level"
  | "role"
  | "tenure_days"

export type EmployeeMetrics = {
  employment_status: EmploymentStatus
  okr_submitted: boolean
  attendance: number
  responsibility_level: number
  role: string
  tenure_days: number
}

export type EligibilityRule = {
  id: string
  rule_type: RuleType
  operator: Operator
  value: string
}
