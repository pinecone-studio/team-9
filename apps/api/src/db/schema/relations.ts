import { relations } from "drizzle-orm";

import { benefitEligibility } from "./benefit-eligibility";
import { benefitRequests } from "./benefit-requests";
import { benefits } from "./benefits";
import { contracts } from "./contracts";
import { eligibilityRules } from "./eligibility-rules";
import { employees } from "./employees";
import { benefitCategories } from "./benefit-categories";

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
