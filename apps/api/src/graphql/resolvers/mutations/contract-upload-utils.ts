const ALLOWED_FILE_TYPES: Record<string, string> = {
	pdf: 'application/pdf',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export function getContentTypeFromFileName(fileName: string): string {
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

export function parseBase64Payload(fileBase64: string): { base64: string; contentTypeFromPayload: string | null } {
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

export function decodeBase64ToBytes(base64: string): Uint8Array {
	return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export function validateFileSignature(bytes: Uint8Array, contentType: string) {
	if (bytes.length < 4) {
		throw new Error('Uploaded file is too small or corrupted');
	}

	if (contentType === 'application/pdf') {
		const pdfSignature = [0x25, 0x50, 0x44, 0x46];
		if (!pdfSignature.every((v, i) => bytes[i] === v)) {
			throw new Error('Uploaded PDF file is invalid or corrupted');
		}
	}

	if (contentType === 'application/msword') {
		const oleSignature = [0xd0, 0xcf, 0x11, 0xe0];
		if (!oleSignature.every((v, i) => bytes[i] === v)) {
			throw new Error('Uploaded DOC file is invalid or corrupted');
		}
	}

	if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
		const zipSignature = [0x50, 0x4b, 0x03, 0x04];
		if (!zipSignature.every((v, i) => bytes[i] === v)) {
			throw new Error('Uploaded DOCX file is invalid or corrupted');
		}
	}
}
