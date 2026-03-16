import { relations } from "drizzle-orm";

import { approvalRequests } from "./approval-requests";
import { benefitEligibility } from "./benefit-eligibility";
import { benefitRules } from "./benefit-rules";
import { benefitRequests } from "./benefit-requests";
import { benefits } from "./benefits";
import { contracts } from "./contracts";
import { eligibilityRules } from "./eligibility-rules";
import { employees } from "./employees";
import { benefitCategories } from "./benefit-categories";
import { ruleCategories } from "./rule-categories";
import { rules } from "./rules";

export const employeesRelations = relations(employees, ({ many }) => ({
  benefitEligibility: many(benefitEligibility),
  benefitRequests: many(benefitRequests),
}));

export const contractsRelations = relations(contracts, ({ one }) => ({
  benefit: one(benefits, {
    fields: [contracts.benefitId],
    references: [benefits.id],
  }),
}));

export const benefitsRelations = relations(benefits, ({ one, many }) => ({
  category: one(benefitCategories, {
    fields: [benefits.categoryId],
    references: [benefitCategories.id],
  }),
  contracts: many(contracts),
  eligibilityRules: many(eligibilityRules),
  benefitRules: many(benefitRules),
  benefitEligibility: many(benefitEligibility),
  benefitRequests: many(benefitRequests),
}));

export const benefitCategoriesRelations = relations(benefitCategories, ({ many }) => ({
  benefits: many(benefits),
}));
export const eligibilityRulesRelations = relations(eligibilityRules, ({ one }) => ({
  benefit: one(benefits, {
    fields: [eligibilityRules.benefitId],
    references: [benefits.id],
  }),
}));

export const ruleCategoriesRelations = relations(ruleCategories, ({ many }) => ({
  rules: many(rules),
}));

export const rulesRelations = relations(rules, ({ one, many }) => ({
  category: one(ruleCategories, {
    fields: [rules.categoryId],
    references: [ruleCategories.id],
  }),
  benefitRules: many(benefitRules),
}));

export const benefitRulesRelations = relations(benefitRules, ({ one }) => ({
  benefit: one(benefits, {
    fields: [benefitRules.benefitId],
    references: [benefits.id],
  }),
  rule: one(rules, {
    fields: [benefitRules.ruleId],
    references: [rules.id],
  }),
}));

export const benefitEligibilityRelations = relations(benefitEligibility, ({ one }) => ({
  employee: one(employees, {
    fields: [benefitEligibility.employeeId],
    references: [employees.id],
  }),
  benefit: one(benefits, {
    fields: [benefitEligibility.benefitId],
    references: [benefits.id],
  }),
}));

export const benefitRequestsRelations = relations(benefitRequests, ({ one }) => ({
  employee: one(employees, {
    fields: [benefitRequests.employeeId],
    references: [employees.id],
  }),
  benefit: one(benefits, {
    fields: [benefitRequests.benefitId],
    references: [benefits.id],
  }),
}));

export const approvalRequestsRelations = relations(approvalRequests, () => ({}));
