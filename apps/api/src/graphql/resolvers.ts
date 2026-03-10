import { and, asc, eq, inArray } from "drizzle-orm";

import { getDb } from "../db";
import { benefitEligibility } from "../db/schema/benefit-eligibility";
import { benefits } from "../db/schema/benefits";
import { employees } from "../db/schema/employees";

type EmployeeRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type BenefitRecord = {
  id: string;
  name: string;
  category: string | null;
  subsidy_percent?: number | null;
  vendor_name?: string | null;
  description?: string | null;
};

type Employee = {
  id: string;
  name: string;
  email: string;
  position: string;
};

type Benefit = {
  id: string;
  title: string;
  description: string;
  category: string;
};

type GraphQLContext = {
  DB: D1Database;
};

type EmployeeIdArgs = {
  id: string;
};

type AddEmployeeArgs = {
  name: string;
  email: string;
  position: string;
};

function mapEmployee(record: EmployeeRecord): Employee {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    position: record.role,
  };
}

function mapBenefit(record: BenefitRecord): Benefit {
  const subsidyText =
    typeof record.subsidy_percent === "number"
      ? `${record.subsidy_percent}% subsidy`
      : null;

  const description = record.vendor_name
    ? subsidyText
      ? `${record.vendor_name} - ${subsidyText}`
      : record.vendor_name
    : record.description ?? subsidyText ?? "Benefit details unavailable";

  return {
    id: record.id,
    title: record.name,
    description,
    category: record.category ?? "General",
  };
}

async function listEmployees(DB: D1Database): Promise<Employee[]> {
  const db = getDb({ DB });

  const rows = await db
    .select({
      id: employees.id,
      name: employees.name,
      email: employees.email,
      role: employees.role,
    })
    .from(employees)
    .orderBy(asc(employees.name));

  return rows.map(mapEmployee);
}

async function getEmployeeById(
  DB: D1Database,
  id: string,
): Promise<Employee | null> {
  const db = getDb({ DB });

  const result = await db
    .select({
      id: employees.id,
      name: employees.name,
      email: employees.email,
      role: employees.role,
    })
    .from(employees)
    .where(eq(employees.id, id))
    .limit(1);

  return result[0] ? mapEmployee(result[0]) : null;
}

async function listBenefits(DB: D1Database): Promise<Benefit[]> {
  const db = getDb({ DB });

  const rows = await db
    .select({
      id: benefits.id,
      name: benefits.name,
      category: benefits.category,
      subsidy_percent: benefits.subsidyPercent,
      vendor_name: benefits.vendorName,
    })
    .from(benefits)
    .where(eq(benefits.isActive, true))
    .orderBy(asc(benefits.name));

  return rows.map((row) =>
    mapBenefit({
      id: String(row.id),
      name: row.name,
      category: row.category,
      subsidy_percent: row.subsidy_percent,
      vendor_name: row.vendor_name,
    }),
  );
}

async function listEmployeeBenefits(
  DB: D1Database,
  employeeId: string,
): Promise<Benefit[]> {
  const db = getDb({ DB });
  const eligibleStatuses = ["active", "eligible"] as const;

  const rows = await db
    .select({
      id: benefits.id,
      name: benefits.name,
      category: benefits.category,
      subsidy_percent: benefits.subsidyPercent,
      vendor_name: benefits.vendorName,
    })
    .from(benefitEligibility)
    .innerJoin(benefits, eq(benefits.id, benefitEligibility.benefitId))
    .where(
      and(
        eq(benefitEligibility.employeeId, employeeId),
        inArray(benefitEligibility.status, eligibleStatuses),
        eq(benefits.isActive, true),
      ),
    )
    .orderBy(asc(benefits.name));

  return rows.map((row) =>
    mapBenefit({
      id: String(row.id),
      name: row.name,
      category: row.category,
      subsidy_percent: row.subsidy_percent,
      vendor_name: row.vendor_name,
    }),
  );
}

async function addEmployee(
  DB: D1Database,
  args: AddEmployeeArgs,
): Promise<Employee> {
  const db = getDb({ DB });

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.insert(employees).values({
    id,
    email: args.email,
    name: args.name,
    nameEng: args.name,
    role: args.position,
    department: "Unassigned",
    responsibilityLevel: 1,
    employmentStatus: "active",
    hireDate: now,
    okrSubmitted: false,
    lateArrivalCount: 0,
    lateArrivalUpdatedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    name: args.name,
    email: args.email,
    position: args.position,
  };
}

export const resolvers = {
  Query: {
    employees: (_: unknown, __: unknown, { DB }: GraphQLContext) =>
      listEmployees(DB),

    employee: (_: unknown, { id }: EmployeeIdArgs, { DB }: GraphQLContext) =>
      getEmployeeById(DB, id),

    allBenefits: (_: unknown, __: unknown, { DB }: GraphQLContext) =>
      listBenefits(DB),
  },

  Employee: {
    benefits: (parent: Employee, _: unknown, { DB }: GraphQLContext) =>
      listEmployeeBenefits(DB, parent.id),
  },

  Mutation: {
    addEmployee: (
      _: unknown,
      args: AddEmployeeArgs,
      { DB }: GraphQLContext,
    ) => addEmployee(DB, args),
  },
};
