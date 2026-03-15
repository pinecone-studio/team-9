import type { MutationCreateRuleDefinitionArgs, RuleDefinition } from '../../generated/resolvers-types';
import { applyCreateRuleDefinition } from './rule-definition-service';

export async function createRuleDefinition(DB: D1Database, args: MutationCreateRuleDefinitionArgs): Promise<RuleDefinition> {
	return applyCreateRuleDefinition(DB, args.input);
}
