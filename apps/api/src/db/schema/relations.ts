import { relations } from "drizzle-orm";

import { benefitEligibility } from "./benefit-eligibility";
import { benefitRequests } from "./benefit-requests";
import { benefits } from "./benefits";
import { contracts } from "./contracts";
import { eligibilityRules } from "./eligibility-rules";
import { employees } from "./employees";

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

export const benefitsRelations = relations(benefits, ({ many }) => ({
  contracts: many(contracts),
  eligibilityRules: many(eligibilityRules),
  benefitEligibility: many(benefitEligibility),
  benefitRequests: many(benefitRequests),
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
