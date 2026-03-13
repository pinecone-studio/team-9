export const R2_SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function buildR2ObjectKey(benefitId: string, version: string, filename: string): string {
	const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
	return `contracts/${benefitId}/${version}/${safeName}`;
}

export async function getSignedDownloadUrl(bucket: R2Bucket, r2ObjectKey: string): Promise<string> {
	const url = await (bucket as any).createSignedUrl(r2ObjectKey, {
		expiresIn: R2_SIGNED_URL_TTL_SECONDS,
	});
	return url;
}

export async function uploadContractToR2(
	bucket: R2Bucket,
	r2ObjectKey: string,
	fileBytes: ArrayBuffer | Uint8Array,
	contentType: string,
): Promise<{ r2ObjectKey: string; sha256Hash: string }> {
	const body = fileBytes instanceof Uint8Array ? fileBytes : new Uint8Array(fileBytes);
	const exactBuffer = body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer;

	const hashBuffer = await crypto.subtle.digest('SHA-256', exactBuffer);
	const sha256Hash = Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	await bucket.put(r2ObjectKey, exactBuffer, {
		httpMetadata: {
			contentType,
		},
		customMetadata: {
			sha256: sha256Hash,
		},
	});

	return { r2ObjectKey, sha256Hash };
}

export async function deleteFromR2(bucket: R2Bucket, r2ObjectKey: string): Promise<void> {
	await bucket.delete(r2ObjectKey);
}
