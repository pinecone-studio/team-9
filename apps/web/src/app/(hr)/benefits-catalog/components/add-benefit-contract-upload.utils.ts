export const ACCEPTED_CONTRACT_TYPES = ".pdf,.doc,.docx";

export function isAcceptedContractFile(fileName: string) {
  const lowered = fileName.toLowerCase();
  return lowered.endsWith(".pdf") || lowered.endsWith(".doc") || lowered.endsWith(".docx");
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(1)} MB`;
}

export function normalizeContractDateInput(value: string) {
  return value.replace(/[^\d.]/g, "").slice(0, 10);
}

export function formatNativeDate(value: string) {
  return value.replace(/-/g, ".");
}
