export const ACCEPTED_CONTRACT_TYPES = ".pdf";

export function normalizeDateInput(value: string) {
  return value.replace(/[^\d.]/g, "").slice(0, 10);
}

export function fromNativeDate(value: string) {
  if (!value) {
    return "";
  }
  return value.replace(/-/g, ".");
}

export function isAcceptedContractFile(file: File) {
  return file.name.toLowerCase().endsWith(".pdf");
}
