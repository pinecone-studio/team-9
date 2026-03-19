import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";

import { reviewApprovalRequest } from "../src/graphql/resolvers/mutations/review-approval-request";

async function bootstrapReviewApprovalRequestFixtures() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS benefit_categories (
      id text PRIMARY KEY NOT NULL,
      name text NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS rule_categories (
      id text PRIMARY KEY NOT NULL,
      name text NOT NULL UNIQUE,
      description text
    )`,
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
      description text,
      category_id text NOT NULL,
      subsidy_percent integer NOT NULL,
      vendor_name text,
      requires_contract integer NOT NULL DEFAULT false,
      is_core integer NOT NULL DEFAULT false,
      approval_role text NOT NULL DEFAULT 'hr_admin',
      active_contract_id text,
      is_active integer NOT NULL DEFAULT true
    )`,
    `CREATE TABLE IF NOT EXISTS rules (
      id text PRIMARY KEY NOT NULL,
      category_id text NOT NULL,
      rule_type text NOT NULL,
      name text NOT NULL,
      description text NOT NULL,
      value_type text NOT NULL,
      allowed_operators text NOT NULL DEFAULT '[]',
      options_json text,
      default_unit text,
      default_value text,
      default_operator text NOT NULL DEFAULT 'eq',
      is_active integer NOT NULL DEFAULT true,
      UNIQUE(category_id, name)
    )`,
    `CREATE TABLE IF NOT EXISTS benefit_rules (
      id text PRIMARY KEY NOT NULL,
      benefit_id text NOT NULL,
      rule_id text NOT NULL,
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
    `CREATE TABLE IF NOT EXISTS approval_requests (
      id text PRIMARY KEY NOT NULL,
      entity_type text NOT NULL,
      entity_id text,
      action_type text NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      target_role text NOT NULL,
      requested_by text NOT NULL,
      reviewed_by text,
      review_comment text,
      payload_json text NOT NULL,
      snapshot_json text,
      created_at text NOT NULL,
      reviewed_at text,
      is_active integer NOT NULL DEFAULT true
    )`,
    "DELETE FROM approval_requests",
    "DELETE FROM benefit_eligibility",
    "DELETE FROM benefit_rules",
    "DELETE FROM rules",
    "DELETE FROM benefits",
    "DELETE FROM employees",
    "DELETE FROM rule_categories",
    "DELETE FROM benefit_categories",
  ];

  for (const statement of statements) {
    await env.DB.prepare(statement).run();
  }

  await env.DB.prepare(
    `INSERT INTO benefit_categories (id, name) VALUES ('cat-wellness', 'Wellness')`,
  ).run();
  await env.DB.prepare(
    `INSERT INTO rule_categories (id, name, description) VALUES ('rule-core', 'Core', 'Core rules')`,
  ).run();

  await env.DB.prepare(`
    INSERT INTO employees (
      id, email, name, name_eng, role, department, responsibility_level,
      employment_status, hire_date, okr_submitted, late_arrival_count,
      late_arrival_updated_at, created_at, updated_at
    ) VALUES
      ('emp-active', 'active@example.com', 'Active Employee', 'Active Employee', 'teacher', 'academics', 2, 'active', '2024-01-01T00:00:00.000Z', 1, 0, '2026-03-01T00:00:00.000Z', '2026-03-01T00:00:00.000Z', '2026-03-01T00:00:00.000Z'),
      ('emp-terminated', 'terminated@example.com', 'Former Employee', 'Former Employee', 'teacher', 'academics', 2, 'terminated', '2023-01-01T00:00:00.000Z', 1, 0, '2026-03-01T00:00:00.000Z', '2026-03-01T00:00:00.000Z', '2026-03-01T00:00:00.000Z')
  `).run();

  await env.DB.prepare(`
    INSERT INTO benefits (
      id, name, description, category_id, subsidy_percent, vendor_name,
      requires_contract, is_core, approval_role, active_contract_id, is_active
    ) VALUES
      ('benefit-a', 'Benefit A', 'Primary benefit', 'cat-wellness', 50, 'Vendor A', 0, 0, 'hr_admin', NULL, 1),
      ('benefit-b', 'Benefit B', 'Secondary benefit', 'cat-wellness', 30, 'Vendor B', 0, 0, 'hr_admin', NULL, 1)
  `).run();

  await env.DB.prepare(`
    INSERT INTO rules (
      id, category_id, rule_type, name, description, value_type,
      allowed_operators, options_json, default_unit, default_value, default_operator, is_active
    ) VALUES
      ('rule-employment', 'rule-core', 'employment_status', 'Employment Status', 'Employment gate', 'enum', '["eq","neq"]', '["active","terminated"]', NULL, '"active"', 'eq', 1)
  `).run();

  await env.DB.prepare(`
    INSERT INTO benefit_rules (id, benefit_id, rule_id, operator, value, error_message, priority, is_active)
    VALUES
      ('benefit-rule-a', 'benefit-a', 'rule-employment', 'eq', '"active"', 'Must be active', 1, 1),
      ('benefit-rule-b', 'benefit-b', 'rule-employment', 'eq', '"active"', 'Must be active', 1, 1)
  `).run();

  await env.DB.prepare(`
    INSERT INTO benefit_eligibility (
      employee_id, benefit_id, status, rule_evaluation_json, computed_at, override_by, override_reason, override_expires_at
    ) VALUES
      ('emp-active', 'benefit-a', 'eligible', '[{"ruleType":"employment_status","passed":true}]', '2026-03-10T00:00:00.000Z', NULL, NULL, NULL),
      ('emp-terminated', 'benefit-a', 'locked', '[{"ruleType":"employment_status","passed":false}]', '2026-03-10T00:00:00.000Z', NULL, NULL, NULL),
      ('emp-active', 'benefit-b', 'eligible', '[{"ruleType":"employment_status","passed":true}]', '2026-03-11T00:00:00.000Z', NULL, NULL, NULL),
      ('emp-terminated', 'benefit-b', 'locked', '[{"ruleType":"employment_status","passed":false}]', '2026-03-11T00:00:00.000Z', NULL, NULL, NULL)
  `).run();

  const payloadJson = JSON.stringify({
    benefit: {
      id: "benefit-a",
      name: "Benefit A",
      description: "Primary benefit updated",
      categoryId: "cat-wellness",
      subsidyPercent: 50,
      vendorName: "Vendor A",
      requiresContract: false,
      isCore: false,
      isActive: true,
      approvalRole: "hr_admin",
    },
    ruleAssignments: [
      {
        ruleId: "rule-employment",
        operator: "neq",
        value: JSON.stringify("terminated"),
        errorMessage: "Must not be terminated",
        priority: 1,
        isActive: true,
      },
    ],
  });

  await env.DB.prepare(`
    INSERT INTO approval_requests (
      id, entity_type, entity_id, action_type, status, target_role, requested_by,
      reviewed_by, review_comment, payload_json, snapshot_json, created_at, reviewed_at, is_active
    ) VALUES (?, 'benefit', 'benefit-a', 'update', 'pending', 'hr_admin', 'requester@example.com', NULL, NULL, ?, NULL, '2026-03-12T00:00:00.000Z', NULL, 1)
  `)
    .bind("approval-benefit-a", payloadJson)
    .run();
}

describe("reviewApprovalRequest", () => {
  it("recomputes only the approved benefit and returns promptly with review metadata", async () => {
    await bootstrapReviewApprovalRequestFixtures();

    const result = await reviewApprovalRequest(
      {
        DB: env.DB,
        CONTRACTS_BUCKET: {} as R2Bucket,
      },
      {
        input: {
          approved: true,
          id: "approval-benefit-a",
          reviewComment: null,
          reviewedBy: " reviewer@example.com ",
        },
      },
    );

    expect(result.status).toBe("approved");
    expect(result.reviewed_by).toBe("reviewer@example.com");
    expect(result.review_comment).toBeNull();
    expect(result.entity_id).toBe("benefit-a");

    const approvalRow = await env.DB.prepare(`
      SELECT status, reviewed_by, review_comment
      FROM approval_requests
      WHERE id = 'approval-benefit-a'
    `).first<{ status: string; reviewed_by: string | null; review_comment: string | null }>();

    expect(approvalRow).toEqual({
      review_comment: null,
      reviewed_by: "reviewer@example.com",
      status: "approved",
    });

    const benefitAEligibility = await env.DB.prepare(`
      SELECT employee_id, status, computed_at
      FROM benefit_eligibility
      WHERE benefit_id = 'benefit-a'
      ORDER BY employee_id
    `).all<{ employee_id: string; status: string; computed_at: string }>();
    const benefitBEligibility = await env.DB.prepare(`
      SELECT employee_id, status, computed_at
      FROM benefit_eligibility
      WHERE benefit_id = 'benefit-b'
      ORDER BY employee_id
    `).all<{ employee_id: string; status: string; computed_at: string }>();

    expect(benefitAEligibility.results).toEqual([
      {
        employee_id: "emp-active",
        status: "eligible",
        computed_at: expect.not.stringMatching("2026-03-10T00:00:00.000Z"),
      },
      {
        employee_id: "emp-terminated",
        status: "locked",
        computed_at: expect.not.stringMatching("2026-03-10T00:00:00.000Z"),
      },
    ]);
    expect(benefitBEligibility.results).toEqual([
      {
        employee_id: "emp-active",
        status: "eligible",
        computed_at: "2026-03-11T00:00:00.000Z",
      },
      {
        employee_id: "emp-terminated",
        status: "locked",
        computed_at: "2026-03-11T00:00:00.000Z",
      },
    ]);
  });
});
