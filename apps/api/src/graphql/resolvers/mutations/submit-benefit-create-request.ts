import { getDb } from '../../../db';
import { approvalRequests } from '../../../db/schema/approval-requests';
import { deleteFromR2, uploadContractToR2 } from '../../../lib/r2';
import {
	ApprovalActionType,
	ApprovalEntityType,
	ApprovalRequestStatus,
	type ApprovalRequest,
	type MutationSubmitBenefitCreateRequestArgs,
} from '../../generated/resolvers-types';
import { mapApprovalRequest } from '../approval-request-mappers';
import {
	decodeBase64ToBytes,
	getContentTypeFromFileName,
	parseBase64Payload,
	validateFileSignature,
} from './contract-upload-utils';
import { prepareCreateBenefit } from './benefit-service';
import {
	scheduleNotification,
	sendApprovalRequestSubmittedNotification,
	type NotificationRuntime,
} from '../../../notifications';

type SubmitBenefitCreateEnv = NotificationRuntime & {
	DB: D1Database;
	CONTRACTS_BUCKET: R2Bucket;
};

type ContractUploadPayload = {
	effectiveDate: string;
	expiryDate: string;
	fileName: string;
	r2ObjectKey: string;
	sha256Hash: string;
	version: string;
};

function buildPendingContractObjectKey(requestId: string, version: string, fileName: string): string {
	const safeVersion = version.replace(/[^a-zA-Z0-9._-]/g, '_');
	const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
	return `contracts/pending/${requestId}/${safeVersion}/${safeName}`;
}

async function uploadPendingContractToR2(
	bucket: R2Bucket,
	requestId: string,
	contractUpload: NonNullable<MutationSubmitBenefitCreateRequestArgs['input']['contractUpload']>,
): Promise<ContractUploadPayload> {
	const contentType = getContentTypeFromFileName(contractUpload.fileName);
	const { base64, contentTypeFromPayload } = parseBase64Payload(contractUpload.fileBase64);

	if (contentTypeFromPayload && contentTypeFromPayload !== contentType) {
		throw new Error(`File type mismatch: filename implies ${contentType}, payload says ${contentTypeFromPayload}`);
	}

	const bytes = decodeBase64ToBytes(base64);
	validateFileSignature(bytes, contentType);

	const r2ObjectKey = buildPendingContractObjectKey(requestId, contractUpload.version, contractUpload.fileName);
	const { sha256Hash } = await uploadContractToR2(bucket, r2ObjectKey, bytes, contentType);

	return {
		version: contractUpload.version,
		effectiveDate: contractUpload.effectiveDate,
		expiryDate: contractUpload.expiryDate,
		fileName: contractUpload.fileName,
		r2ObjectKey,
		sha256Hash,
	};
}

export async function submitBenefitCreateRequest(
	env: SubmitBenefitCreateEnv,
	args: MutationSubmitBenefitCreateRequestArgs,
): Promise<ApprovalRequest> {
	const db = getDb({ DB: env.DB });
	const id = crypto.randomUUID();
	const input = args.input;
	const createdAt = new Date().toISOString();
	const prepared = await prepareCreateBenefit(env.DB, input.benefit);
	const requestedBy = input.requestedBy.trim();
	let contractUploadPayload: ContractUploadPayload | null = null;

	if (!requestedBy) {
		throw new Error('requestedBy is required');
	}

	if (prepared.requiresContract && !prepared.vendorName) {
		throw new Error('Vendor name is required when requiresContract is enabled');
	}

	if (prepared.requiresContract && !input.contractUpload) {
		throw new Error('Contract upload is required when requiresContract is enabled');
	}

	if (!prepared.requiresContract && input.contractUpload) {
		throw new Error('Contract upload is only allowed when requiresContract is enabled');
	}

	if (input.contractUpload) {
		contractUploadPayload = await uploadPendingContractToR2(env.CONTRACTS_BUCKET, id, input.contractUpload);
	}

	const payloadJson = JSON.stringify({
		benefit: input.benefit,
		ruleAssignments: input.ruleAssignments ?? [],
		contractUpload: contractUploadPayload,
	});

	try {
		await db.insert(approvalRequests).values({
			id,
			entityType: ApprovalEntityType.Benefit,
			entityId: null,
			actionType: ApprovalActionType.Create,
			status: ApprovalRequestStatus.Pending,
			targetRole: prepared.approvalRole,
			requestedBy,
			payloadJson,
			snapshotJson: null,
			createdAt,
			isActive: true,
		});
	} catch (error) {
		if (contractUploadPayload) {
			await deleteFromR2(env.CONTRACTS_BUCKET, contractUploadPayload.r2ObjectKey);
		}
		throw error;
	}

	scheduleNotification(env, 'approval_request_submitted', () =>
		sendApprovalRequestSubmittedNotification(env, {
			actionType: ApprovalActionType.Create,
			entityType: ApprovalEntityType.Benefit,
			requestId: id,
			requestedBy,
			targetRole: prepared.approvalRole,
		}),
	);

	return mapApprovalRequest({
		id,
		entityType: ApprovalEntityType.Benefit,
		entityId: null,
		actionType: ApprovalActionType.Create,
		status: ApprovalRequestStatus.Pending,
		targetRole: prepared.approvalRole,
		requestedBy,
		reviewedBy: null,
		reviewComment: null,
		payloadJson,
		snapshotJson: null,
		createdAt,
		reviewedAt: null,
		isActive: true,
	});
}
