import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";

import { evaluateBenefit } from "../src/eligibility/benefit-evaluator";
import { computeEmployeeEligibility } from "../src/eligibility/engine";
import { buildEmployeeMetrics, type EmployeeRow } from "../src/eligibility/metrics";
import type { EligibilityRule } from "../src/eligibility/types";

const SEEDED_EMPLOYEE_ID = "emp-smoke";

type ActiveBenefitRow = {
  id: string;
  name: string;
};

type PersistedEligibilityRow = {
  benefitId: string;
  status: "eligible" | "locked" | "active" | "pending";
  ruleEvaluationJson: string;
};

type RuleRow = EligibilityRule & {
  benefitId: string;
};

const bootstrapEligibilityFixtures = async () => {
  const bootstrapStatements = [
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

  for (const statement of bootstrapStatements) {
    await env.DB.prepare(statement).run();
  }

  await env.DB.prepare(`
    INSERT INTO employees (
      id,
      email,
      name,
      name_eng,
      role,
      department,
      responsibility_level,
      employment_status,
      hire_date,
      okr_submitted,
      late_arrival_count,
      late_arrival_updated_at,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      SEEDED_EMPLOYEE_ID,
      "smoke@example.com",
      "Smoke Test",
      "Smoke Test",
      "backend_engineer",
      "engineering",
      2,
      "active",
      "2024-01-15T00:00:00.000Z",
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
      ('gym', 'Gym Membership', 'wellness', 50, 'PineFit', 1, NULL, 1),
      ('ux-tools', 'UX Tools', 'career', 100, NULL, 0, NULL, 1)
  `).run();

  await env.DB.prepare(`
    INSERT INTO eligibility_rules (id, benefit_id, rule_type, operator, value, error_message, priority, is_active)
    VALUES
      ('rule-gym-employment', 'gym', 'employment_status', 'eq', '"active"', 'Employee must be active', 1, 1),
      ('rule-gym-okr', 'gym', 'okr_submitted', 'eq', 'true', 'OKR must be submitted', 2, 1),
      ('rule-gym-attendance', 'gym', 'attendance', 'lte', '2', 'Attendance threshold exceeded', 3, 1),
      ('rule-ux-role', 'ux-tools', 'role', 'eq', '"ux_engineer"', 'Role must be ux_engineer', 1, 1)
  `).run();
};

describe("eligibility smoke", () => {
  it("computes eligibility for seeded D1 data and persists expected results", async () => {
    await bootstrapEligibilityFixtures();

    const employee = await env.DB.prepare(
      `
        SELECT
          id,
          employment_status,
          okr_submitted,
          late_arrival_count,
          responsibility_level,
          role,
          hire_date
        FROM employees
        ORDER BY id
        LIMIT 1
      `
    ).first<{ id: string } & EmployeeRow>();
    expect(employee).toBeTruthy();

    const activeBenefits = (
      await env.DB.prepare(
        `
          SELECT id, name
          FROM benefits
          WHERE is_active = 1
          ORDER BY id
        `
      ).all<ActiveBenefitRow>()
    ).results;

    expect(activeBenefits.length).toBe(2);

    const seededRules = (
      await env.DB.prepare(
        `
          SELECT
            id,
            benefit_id AS benefitId,
            rule_type AS rule_type,
            operator,
            value
          FROM eligibility_rules
          WHERE is_active = 1
          ORDER BY benefit_id, priority, id
        `
      ).all<RuleRow>()
    ).results;

    expect(seededRules.length).toBe(4);

    await env.DB.prepare("DELETE FROM benefit_eligibility WHERE employee_id = ?")
      .bind(employee!.id)
      .run();

    await computeEmployeeEligibility(env, employee!.id);

    const persistedRows = (
      await env.DB.prepare(
        `
          SELECT
            benefit_id AS benefitId,
            status,
            rule_evaluation_json AS ruleEvaluationJson
          FROM benefit_eligibility
          WHERE employee_id = ?
          ORDER BY benefit_id
        `
      )
        .bind(employee!.id)
        .all<PersistedEligibilityRow>()
    ).results;

    expect(persistedRows.length).toBe(activeBenefits.length);

    const metrics = buildEmployeeMetrics(employee!);
    const rulesByBenefit = new Map<string, EligibilityRule[]>();

    console.log("employee", employee);
    console.log("metrics", metrics);
    console.log("seededRules", seededRules);
    console.log("persistedRows", persistedRows);

    for (const rule of seededRules) {
      const existingRules = rulesByBenefit.get(rule.benefitId) ?? [];
      existingRules.push({
        id: rule.id,
        rule_type: rule.rule_type,
        operator: rule.operator,
        value: rule.value,
      });
      rulesByBenefit.set(rule.benefitId, existingRules);
    }

    for (const benefit of activeBenefits) {
      const persisted = persistedRows.find((row) => row.benefitId === benefit.id);

      expect(persisted, `Expected persisted eligibility row for benefit ${benefit.name}.`).toBeTruthy();

      const evaluation = evaluateBenefit(rulesByBenefit.get(benefit.id) ?? [], metrics);

      console.log("benefitEvaluation", {
        benefitId: benefit.id,
        benefitName: benefit.name,
        expectedStatus: evaluation.status,
        expectedResults: evaluation.results,
      });

      expect(persisted!.status).toBe(evaluation.status);
      expect(JSON.parse(persisted!.ruleEvaluationJson)).toEqual(evaluation.results);
    }
  });
});
