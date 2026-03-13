import { eq } from 'drizzle-orm';
import { Env, getDb } from '../../../db';
import { contracts } from '../../../db/schema/contracts';
import { benefits } from '../../../db/schema/benefits';
import { buildR2ObjectKey, uploadContractToR2 } from '../../../lib/r2';

const ALLOWED_FILE_TYPES: Record<string, string> = {
	pdf: 'application/pdf',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	xls: 'application/vnd.ms-excel',
	xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	csv: 'text/csv',
	txt: 'text/plain',
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
};

export interface UploadContractInput {
	benefitId: string;
	vendorName: string;
	version: string;
	effectiveDate: string;
	expiryDate: string;
	fileBase64: string;
	fileName: string;
}

function getContentType(fileName: string): string {
	const extension = fileName.split('.').pop()?.toLowerCase();

	if (!extension || !(extension in ALLOWED_FILE_TYPES)) {
		throw new Error(`Unsupported file type. Allowed types: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}`);
	}

	return ALLOWED_FILE_TYPES[extension];
}

function normalizeBase64(base64: string): string {
	const normalized = base64
		.replace(/ /g, '+')
		.replace(/-/g, '+')
		.replace(/_/g, '/')
		.replace(/[\r\n\t]/g, '');

	const padding = normalized.length % 4;
	if (padding === 0) {
		return normalized;
	}

	return normalized.padEnd(normalized.length + (4 - padding), '=');
}

function parseBase64Payload(fileBase64: string): { base64: string; contentTypeFromPayload: string | null } {
	const normalized = fileBase64.trim();

	if (!normalized.startsWith('data:')) {
		return { base64: normalizeBase64(normalized), contentTypeFromPayload: null };
	}

	const commaIndex = normalized.indexOf(',');
	if (commaIndex === -1) {
		throw new Error('Invalid base64 payload');
	}

	const header = normalized.slice(5, commaIndex);
	const base64 = normalizeBase64(normalized.slice(commaIndex + 1));
	const [contentType] = header.split(';');

	if (!header.includes(';base64')) {
		throw new Error('Only base64-encoded file payloads are supported');
	}

	return { base64, contentTypeFromPayload: contentType || null };
}

function validateFileSignature(bytes: Uint8Array, contentType: string) {
	if (bytes.length < 4) {
		throw new Error('Uploaded file is too small or corrupted');
	}

	if (contentType === 'image/png') {
		const pngSignature = [0x89, 0x50, 0x4e, 0x47];
		if (!pngSignature.every((v, i) => bytes[i] === v)) {
			throw new Error('Uploaded PNG file is invalid or corrupted');
		}
	}

	if (contentType === 'image/jpeg') {
		if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
			throw new Error('Uploaded JPEG file is invalid or corrupted');
		}
	}

	if (contentType === 'application/pdf') {
		const pdfSignature = [0x25, 0x50, 0x44, 0x46];
		if (!pdfSignature.every((v, i) => bytes[i] === v)) {
			throw new Error('Uploaded PDF file is invalid or corrupted');
		}
	}
}

export async function uploadContract(env: Env, input: UploadContractInput) {
	const db = getDb(env);

	const [benefit] = await db.select({ id: benefits.id }).from(benefits).where(eq(benefits.id, input.benefitId)).limit(1);

	if (!benefit) {
		throw new Error(`Benefit not found: ${input.benefitId}`);
	}

	const contentType = getContentType(input.fileName);
	const { base64, contentTypeFromPayload } = parseBase64Payload(input.fileBase64);

	if (contentTypeFromPayload && contentTypeFromPayload !== contentType) {
		throw new Error(`File type mismatch: filename implies ${contentType}, payload says ${contentTypeFromPayload}`);
	}

	// const binaryStr = atob(base64);
	// const bytes = new Uint8Array(binaryStr.length);
	// for (let i = 0; i < binaryStr.length; i++) {
	// 	bytes[i] = binaryStr.charCodeAt(i);
	// }

	const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
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

	const [created] = await db.select().from(contracts).where(eq(contracts.id, id)).limit(1);

	return created;
}
