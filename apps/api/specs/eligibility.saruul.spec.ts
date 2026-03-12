import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";

import { computeEmployeeEligibility } from "../src/eligibility/engine";

const bootstrapSaruulFixtures = async () => {
  const statements = [
    `CREATE TABLE IF NOT EXISTS employees (
      id text PRIMARY KEY NOT NULL,
      email text NOT NULL UNIQUE,
      name text NOT NULL,
      name_eng text NOT NULL,
      role text NOT NULL,
      department text NOT NULL,
      responsibility_level integer NOT NULL,
      employment_status text NOT NULL DEFAULT 'active',
      hire_date text NOT NULL,
      okr_submitted integer NOT NULL DEFAULT false,
      late_arrival_count integer NOT NULL DEFAULT 0,
      late_arrival_updated_at text,
      created_at text NOT NULL,
      updated_at text NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS benefits (
      id text PRIMARY KEY NOT NULL,
      name text NOT NULL,
      category text NOT NULL,
      subsidy_percent integer NOT NULL,
      vendor_name text,
      requires_contract integer NOT NULL DEFAULT false,
      active_contract_id text,
      is_active integer NOT NULL DEFAULT true
    )`,
    `CREATE TABLE IF NOT EXISTS eligibility_rules (
      id text PRIMARY KEY NOT NULL,
      benefit_id text NOT NULL,
      rule_type text NOT NULL,
      operator text NOT NULL,
      value text NOT NULL,
      error_message text NOT NULL,
      priority integer NOT NULL DEFAULT 1,
      is_active integer NOT NULL DEFAULT true
    )`,
    `CREATE TABLE IF NOT EXISTS benefit_eligibility (
      employee_id text NOT NULL,
      benefit_id text NOT NULL,
      status text NOT NULL,
      rule_evaluation_json text NOT NULL,
      computed_at text NOT NULL,
      override_by text,
      override_reason text,
      override_expires_at text,
      PRIMARY KEY (employee_id, benefit_id)
    )`,
    "DELETE FROM benefit_eligibility",
    "DELETE FROM eligibility_rules",
    "DELETE FROM benefits",
    "DELETE FROM employees",
  ];

  for (const statement of statements) {
    await env.DB.prepare(statement).run();
  }

  await env.DB.prepare(`
    INSERT INTO employees (
      id, email, name, name_eng, role, department, responsibility_level,
      employment_status, hire_date, okr_submitted, late_arrival_count,
      late_arrival_updated_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      "emp-saruul",
      "saruul@example.com",
      "Saruul",
      "Saruul",
      "teacher",
      "academics",
      1,
      "active",
      "2024-01-10T00:00:00.000Z",
      1,
      1,
      "2026-03-11T00:00:00.000Z",
      "2026-03-11T00:00:00.000Z",
      "2026-03-11T00:00:00.000Z"
    )
    .run();

  await env.DB.prepare(`
    INSERT INTO benefits (id, name, category, subsidy_percent, vendor_name, requires_contract, active_contract_id, is_active)
    VALUES
      ('gym-pinefit', 'Gym - PineFit', 'wellness', 50, 'PineFit', 1, NULL, 1),
      ('private-insurance', 'Private Insurance', 'health', 50, NULL, 0, NULL, 1),
      ('digital-wellness', 'Digital Wellness', 'wellness', 100, NULL, 0, NULL, 1)
  `).run();

  await env.DB.prepare(`
    INSERT INTO eligibility_rules (id, benefit_id, rule_type, operator, value, error_message, priority, is_active)
    VALUES
      ('gym-active', 'gym-pinefit', 'employment_status', 'eq', '"active"', 'Not available during probation or leave.', 1, 1),
      ('gym-okr', 'gym-pinefit', 'okr_submitted', 'eq', 'true', 'Submit your current OKR to unlock this benefit.', 2, 1),
      ('gym-attendance', 'gym-pinefit', 'attendance', 'lte', '2', 'Attendance threshold exceeded this month.', 3, 1),
      ('insurance-active', 'private-insurance', 'employment_status', 'eq', '"active"', 'Not available during probation or leave.', 1, 1),
      ('insurance-okr', 'private-insurance', 'okr_submitted', 'eq', 'true', 'Submit your current OKR to unlock this benefit.', 2, 1),
      ('insurance-attendance', 'private-insurance', 'attendance', 'lte', '2', 'Attendance threshold exceeded this month.', 3, 1),
      ('digital-active', 'digital-wellness', 'employment_status', 'neq', '"terminated"', 'Not available after termination.', 1, 1)
  `).run();
};

describe("eligibility Saruul scenario", () => {
  it("computes statuses for Saruul using the image rules", async () => {
    await bootstrapSaruulFixtures();

    await computeEmployeeEligibility(env, "emp-saruul");

    const persistedRows = (
      await env.DB.prepare(`
        SELECT benefit_id AS benefitId, status, rule_evaluation_json AS ruleEvaluationJson
        FROM benefit_eligibility
        WHERE employee_id = 'emp-saruul'
        ORDER BY benefit_id
      `).all<{
        benefitId: string;
        status: string;
        ruleEvaluationJson: string;
      }>()
    ).results;

    console.log("Saruul persistedRows", persistedRows);

    expect(persistedRows).toEqual([
      {
        benefitId: "digital-wellness",
        status: "eligible",
        ruleEvaluationJson: JSON.stringify([
          { ruleType: "employment_status", passed: true },
        ]),
      },
      {
        benefitId: "gym-pinefit",
        status: "eligible",
        ruleEvaluationJson: JSON.stringify([
          { ruleType: "employment_status", passed: true },
          { ruleType: "okr_submitted", passed: true },
          { ruleType: "attendance", passed: true },
        ]),
      },
      {
        benefitId: "private-insurance",
        status: "eligible",
        ruleEvaluationJson: JSON.stringify([
          { ruleType: "employment_status", passed: true },
          { ruleType: "okr_submitted", passed: true },
          { ruleType: "attendance", passed: true },
        ]),
      },
    ]);
  });
});
