import { eq } from 'drizzle-orm';
import { Env, getDb } from '../../../db';
import { contracts } from '../../../db/schema/contracts';
import { benefits } from '../../../db/schema/benefits';
import { buildR2ObjectKey, uploadContractToR2 } from '../../../lib/r2';
import {
	decodeBase64ToBytes,
	getContentTypeFromFileName,
	parseBase64Payload,
	validateFileSignature,
} from './contract-upload-utils';

export interface UploadContractInput {
	benefitId: string;
	vendorName: string;
	version: string;
	effectiveDate: string;
	expiryDate: string;
	fileBase64: string;
	fileName: string;
}

export async function uploadContract(env: Env, input: UploadContractInput) {
	const db = getDb(env);

	const [benefit] = await db.select({ id: benefits.id }).from(benefits).where(eq(benefits.id, input.benefitId)).limit(1);

	if (!benefit) {
		throw new Error(`Benefit not found: ${input.benefitId}`);
	}

	const contentType = getContentTypeFromFileName(input.fileName);
	const { base64, contentTypeFromPayload } = parseBase64Payload(input.fileBase64);

	if (contentTypeFromPayload && contentTypeFromPayload !== contentType) {
		throw new Error(`File type mismatch: filename implies ${contentType}, payload says ${contentTypeFromPayload}`);
	}

	const bytes = decodeBase64ToBytes(base64);
	validateFileSignature(bytes, contentType);
	const r2ObjectKey = buildR2ObjectKey(input.benefitId, input.version, input.fileName);

	const { sha256Hash } = await uploadContractToR2(env.CONTRACTS_BUCKET, r2ObjectKey, bytes, contentType);

	await db.update(contracts).set({ isActive: false }).where(eq(contracts.benefitId, input.benefitId));

	const id = crypto.randomUUID();

	await db.insert(contracts).values({
		id,
		benefitId: input.benefitId,
		vendorName: input.vendorName,
		version: input.version,
		r2ObjectKey,
		sha256Hash,
		effectiveDate: input.effectiveDate,
		expiryDate: input.expiryDate,
		isActive: true,
	});
	await db.update(benefits).set({ activeContractId: id }).where(eq(benefits.id, input.benefitId));

	const [created] = await db.select().from(contracts).where(eq(contracts.id, id)).limit(1);

	return created;
}
