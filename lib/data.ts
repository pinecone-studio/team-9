// Types
export type Role = "employee" | "hr_admin" | "finance_manager" | "ux_engineer" | "teacher";
export type EmploymentStatus = "probation" | "active" | "terminated";
export type BenefitStatus = "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING";
export type BenefitCategory = "Wellness" | "Equipment" | "Financial" | "Career Development" | "Flexibility";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  responsibility_level: 1 | 2 | 3;
  employment_status: EmploymentStatus;
  hire_date: Date;
  okr_submitted: boolean;
  late_arrival_count: number;
  avatar?: string;
}

export interface Benefit {
  id: string;
  name: string;
  description: string;
  category: BenefitCategory;
  subsidy_percentage: number;
  vendor_name?: string;
  requires_contract: boolean;
  is_core: boolean;
  icon: string;
}

export interface RuleEvaluation {
  rule_name: string;
  passed: boolean;
  explanation: string;
}

export interface EmployeeBenefit {
  benefit_id: string;
  employee_id: string;
  status: BenefitStatus;
  rule_evaluations: RuleEvaluation[];
  locked_reason?: string;
  requested_at?: Date;
  approved_at?: Date;
  contract_accepted?: boolean;
  contract_accepted_at?: Date;
}

export interface VendorContract {
  id: string;
  benefit_id: string;
  version: string;
  expiry_date: Date;
  content: string;
  uploaded_at: Date;
  uploaded_by: string;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  actor_id: string;
  actor_name: string;
  target_id?: string;
  target_name?: string;
  details: string;
  ip_address: string;
}

export interface BenefitRequest {
  id: string;
  employee_id: string;
  benefit_id: string;
  status: "pending" | "approved" | "rejected";
  requested_at: Date;
  reviewed_by?: string;
  reviewed_at?: Date;
  rejection_reason?: string;
}

// Sample Data
export const benefits: Benefit[] = [
  // Wellness
  {
    id: "gym",
    name: "Gym Membership",
    description: "Access to PineFit gym facilities with personal training sessions",
    category: "Wellness",
    subsidy_percentage: 50,
    vendor_name: "PineFit",
    requires_contract: true,
    is_core: false,
    icon: "dumbbell",
  },
  {
    id: "insurance",
    name: "Private Insurance",
    description: "Comprehensive health coverage including dental and vision",
    category: "Wellness",
    subsidy_percentage: 50,
    vendor_name: "HealthGuard Plus",
    requires_contract: true,
    is_core: false,
    icon: "shield",
  },
  {
    id: "digital-wellness",
    name: "Digital Wellness",
    description: "Access to meditation apps, mental health support, and wellness resources",
    category: "Wellness",
    subsidy_percentage: 100,
    vendor_name: "MindSpace",
    requires_contract: false,
    is_core: true,
    icon: "heart",
  },
  // Equipment
  {
    id: "macbook",
    name: "MacBook Subsidy",
    description: "Subsidy for purchasing a MacBook for work purposes",
    category: "Equipment",
    subsidy_percentage: 50,
    requires_contract: false,
    is_core: false,
    icon: "laptop",
  },
  {
    id: "ux-tools",
    name: "UX Engineer Tools",
    description: "Premium design and prototyping tool licenses",
    category: "Equipment",
    subsidy_percentage: 100,
    vendor_name: "Figma Enterprise",
    requires_contract: true,
    is_core: false,
    icon: "pen-tool",
  },
  // Career Development
  {
    id: "extra-responsibility",
    name: "Extra Responsibility Benefit",
    description: "Additional compensation for taking on leadership responsibilities",
    category: "Career Development",
    subsidy_percentage: 100,
    requires_contract: false,
    is_core: false,
    icon: "award",
  },
  // Financial
  {
    id: "down-payment",
    name: "Down Payment Assistance",
    description: "Financial assistance for home purchase down payments",
    category: "Financial",
    subsidy_percentage: 100,
    requires_contract: true,
    is_core: false,
    icon: "home",
  },
  {
    id: "okr-bonus",
    name: "OKR Performance Bonus",
    description: "Quarterly bonus based on OKR achievement",
    category: "Financial",
    subsidy_percentage: 100,
    requires_contract: false,
    is_core: false,
    icon: "target",
  },
  // Flexibility
  {
    id: "shit-happened",
    name: "Shit Happened Days",
    description: "Emergency personal days for unexpected life events",
    category: "Flexibility",
    subsidy_percentage: 100,
    requires_contract: false,
    is_core: true,
    icon: "calendar-off",
  },
  {
    id: "remote-work",
    name: "Remote Work",
    description: "Flexibility to work from home or anywhere",
    category: "Flexibility",
    subsidy_percentage: 100,
    requires_contract: false,
    is_core: false,
    icon: "home",
  },
  {
    id: "travel",
    name: "Travel Subsidy",
    description: "Subsidy for work-related and personal development travel",
    category: "Flexibility",
    subsidy_percentage: 50,
    vendor_name: "TravelCorp",
    requires_contract: true,
    is_core: false,
    icon: "plane",
  },
];

export const sampleEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: "employee",
    department: "Engineering",
    responsibility_level: 2,
    employment_status: "active",
    hire_date: new Date("2023-03-15"),
    okr_submitted: true,
    late_arrival_count: 1,
    avatar: "SC",
  },
  {
    id: "emp-002",
    name: "Marcus Johnson",
    email: "marcus.j@company.com",
    role: "ux_engineer",
    department: "Design",
    responsibility_level: 3,
    employment_status: "active",
    hire_date: new Date("2021-06-01"),
    okr_submitted: true,
    late_arrival_count: 0,
    avatar: "MJ",
  },
  {
    id: "emp-003",
    name: "Emily Rodriguez",
    email: "emily.r@company.com",
    role: "teacher",
    department: "Education",
    responsibility_level: 1,
    employment_status: "probation",
    hire_date: new Date("2025-12-01"),
    okr_submitted: false,
    late_arrival_count: 4,
    avatar: "ER",
  },
  {
    id: "emp-004",
    name: "David Kim",
    email: "david.kim@company.com",
    role: "finance_manager",
    department: "Finance",
    responsibility_level: 3,
    employment_status: "active",
    hire_date: new Date("2020-01-15"),
    okr_submitted: true,
    late_arrival_count: 2,
    avatar: "DK",
  },
  {
    id: "emp-005",
    name: "Amanda Foster",
    email: "amanda.f@company.com",
    role: "hr_admin",
    department: "Human Resources",
    responsibility_level: 2,
    employment_status: "active",
    hire_date: new Date("2022-08-20"),
    okr_submitted: true,
    late_arrival_count: 0,
    avatar: "AF",
  },
];

export const sampleContracts: VendorContract[] = [
  {
    id: "contract-001",
    benefit_id: "gym",
    version: "2.1",
    expiry_date: new Date("2027-12-31"),
    content: `PINEFIT GYM MEMBERSHIP AGREEMENT

Version 2.1 - Effective January 2026

TERMS AND CONDITIONS

1. MEMBERSHIP BENEFITS
- Full access to all PineFit gym locations
- 2 personal training sessions per month
- Access to group fitness classes
- Locker and towel service included

2. DURATION
This agreement is valid for 12 months from the date of acceptance.

3. SUBSIDY TERMS
- Company subsidizes 50% of the monthly membership fee
- Employee is responsible for the remaining 50%
- Deductions will be made from monthly payroll

4. CANCELLATION POLICY
- 30-day notice required for cancellation
- Early termination may result in subsidy repayment

5. CODE OF CONDUCT
Members must adhere to PineFit's facility rules and regulations.

By accepting this agreement, you acknowledge that you have read and agree to all terms and conditions stated above.`,
    uploaded_at: new Date("2026-01-01"),
    uploaded_by: "HR Admin",
  },
  {
    id: "contract-002",
    benefit_id: "insurance",
    version: "3.0",
    expiry_date: new Date("2027-06-30"),
    content: `HEALTHGUARD PLUS INSURANCE AGREEMENT

Version 3.0 - Effective January 2026

COVERAGE DETAILS

1. MEDICAL COVERAGE
- Hospitalization up to $500,000 annually
- Outpatient coverage up to $10,000 annually
- Emergency services worldwide

2. DENTAL COVERAGE
- Preventive care: 100% covered
- Basic procedures: 80% covered
- Major procedures: 50% covered

3. VISION COVERAGE
- Annual eye exam: 100% covered
- Frames/lenses allowance: $300 annually
- Contact lens allowance: $200 annually

4. PREMIUM SHARING
- Company pays 50% of total premium
- Employee responsible for remaining 50%

5. ENROLLMENT
Coverage begins on the first day of the month following enrollment.

6. CLAIMS
All claims must be submitted within 90 days of service date.

By accepting this agreement, you acknowledge enrollment in the HealthGuard Plus plan.`,
    uploaded_at: new Date("2026-01-01"),
    uploaded_by: "HR Admin",
  },
  {
    id: "contract-003",
    benefit_id: "travel",
    version: "1.5",
    expiry_date: new Date("2027-03-31"),
    content: `TRAVELCORP TRAVEL SUBSIDY AGREEMENT

Version 1.5 - Effective January 2026

BENEFIT DETAILS

1. ELIGIBLE TRAVEL
- Conference and event attendance
- Professional development trips
- Team offsites and retreats

2. SUBSIDY AMOUNT
- 50% of eligible travel expenses
- Maximum annual benefit: $5,000

3. ELIGIBLE EXPENSES
- Airfare (economy class)
- Hotel accommodation
- Ground transportation
- Per diem allowance

4. BOOKING PROCESS
All travel must be booked through TravelCorp portal.

5. EXPENSE REPORTING
Receipts required for all expenses over $25.

By accepting, you agree to TravelCorp's travel policies and procedures.`,
    uploaded_at: new Date("2026-01-01"),
    uploaded_by: "HR Admin",
  },
  {
    id: "contract-004",
    benefit_id: "ux-tools",
    version: "1.0",
    expiry_date: new Date("2027-12-31"),
    content: `FIGMA ENTERPRISE LICENSE AGREEMENT

Version 1.0 - Effective January 2026

LICENSE TERMS

1. SOFTWARE ACCESS
- Full Figma Professional license
- FigJam collaboration boards
- Design system libraries access

2. USAGE RIGHTS
- License is for professional use only
- May not be transferred or shared
- Must comply with Figma ToS

3. COMPANY COVERAGE
- 100% covered by company
- No employee contribution required

4. SUPPORT
- 24/7 technical support
- Training resources included

By accepting, you agree to proper use of design tools.`,
    uploaded_at: new Date("2026-01-01"),
    uploaded_by: "HR Admin",
  },
  {
    id: "contract-005",
    benefit_id: "down-payment",
    version: "1.2",
    expiry_date: new Date("2028-12-31"),
    content: `DOWN PAYMENT ASSISTANCE PROGRAM AGREEMENT

Version 1.2 - Effective January 2026

PROGRAM DETAILS

1. ASSISTANCE AMOUNT
- Up to $25,000 in down payment assistance
- Interest-free loan structure

2. ELIGIBILITY
- Minimum 24 months employment
- Responsibility level 2 or higher
- First-time home purchase only

3. REPAYMENT TERMS
- 5-year repayment period
- Monthly payroll deductions
- No prepayment penalty

4. CONDITIONS
- Must remain employed during repayment
- Property must be primary residence

By accepting, you agree to all program terms and repayment conditions.`,
    uploaded_at: new Date("2026-01-01"),
    uploaded_by: "HR Admin",
  },
];

export const sampleAuditLogs: AuditLog[] = [
  {
    id: "log-001",
    timestamp: new Date("2026-03-09T09:15:00"),
    action: "BENEFIT_REQUESTED",
    actor_id: "emp-001",
    actor_name: "Sarah Chen",
    target_id: "gym",
    target_name: "Gym Membership",
    details: "Employee requested Gym Membership benefit",
    ip_address: "192.168.1.45",
  },
  {
    id: "log-002",
    timestamp: new Date("2026-03-09T10:30:00"),
    action: "CONTRACT_ACCEPTED",
    actor_id: "emp-001",
    actor_name: "Sarah Chen",
    target_id: "contract-001",
    target_name: "PineFit Agreement v2.1",
    details: "Employee accepted vendor contract for Gym Membership",
    ip_address: "192.168.1.45",
  },
  {
    id: "log-003",
    timestamp: new Date("2026-03-08T14:20:00"),
    action: "BENEFIT_APPROVED",
    actor_id: "emp-005",
    actor_name: "Amanda Foster",
    target_id: "emp-002",
    target_name: "Marcus Johnson",
    details: "HR approved UX Engineer Tools benefit request",
    ip_address: "192.168.1.100",
  },
  {
    id: "log-004",
    timestamp: new Date("2026-03-07T11:45:00"),
    action: "ELIGIBILITY_OVERRIDE",
    actor_id: "emp-005",
    actor_name: "Amanda Foster",
    target_id: "emp-003",
    target_name: "Emily Rodriguez",
    details: "HR granted temporary exception for Remote Work benefit. Reason: Medical accommodation",
    ip_address: "192.168.1.100",
  },
  {
    id: "log-005",
    timestamp: new Date("2026-03-06T16:00:00"),
    action: "CONTRACT_UPLOADED",
    actor_id: "emp-005",
    actor_name: "Amanda Foster",
    target_id: "contract-002",
    target_name: "HealthGuard Plus Agreement v3.0",
    details: "New vendor contract uploaded for Private Insurance",
    ip_address: "192.168.1.100",
  },
  {
    id: "log-006",
    timestamp: new Date("2026-03-05T09:00:00"),
    action: "RULE_UPDATED",
    actor_id: "emp-005",
    actor_name: "Amanda Foster",
    target_id: "tenure-rule",
    target_name: "Tenure Requirement",
    details: "Updated MacBook subsidy tenure requirement from 3 to 6 months",
    ip_address: "192.168.1.100",
  },
];

export const sampleRequests: BenefitRequest[] = [
  {
    id: "req-001",
    employee_id: "emp-001",
    benefit_id: "gym",
    status: "pending",
    requested_at: new Date("2026-03-09T09:15:00"),
  },
  {
    id: "req-002",
    employee_id: "emp-002",
    benefit_id: "ux-tools",
    status: "approved",
    requested_at: new Date("2026-03-05T10:00:00"),
    reviewed_by: "emp-005",
    reviewed_at: new Date("2026-03-08T14:20:00"),
  },
  {
    id: "req-003",
    employee_id: "emp-001",
    benefit_id: "down-payment",
    status: "pending",
    requested_at: new Date("2026-03-07T11:00:00"),
  },
];
