import type { MutationUpdateRuleDefinitionArgs, RuleDefinition } from '../../generated/resolvers-types';
import { applyUpdateRuleDefinition } from './rule-definition-service';

export async function updateRuleDefinition(DB: D1Database, args: MutationUpdateRuleDefinitionArgs): Promise<RuleDefinition> {
	return applyUpdateRuleDefinition(DB, args.input);
}
