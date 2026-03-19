export type ContractUploadInput = {
  effectiveDate: string;
  expiryDate: string;
  fileBase64: string;
  fileName: string;
  version: string;
};

type BuildContractUploadInputArgs = {
  effectiveDate: string;
  expiryDate: string;
  file: File;
};

function isFileInput(
  value: File | BuildContractUploadInputArgs,
): value is File {
  return value instanceof File;
}

export function isEditableDateComplete(value: string) {
  return /^\d{4}\.\d{2}\.\d{2}$/.test(value);
}

export function toIsoEditableDate(value: string) {
  return value.replace(/\./g, "-");
}

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Contract file could not be read."));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => {
      reject(new Error("Contract file could not be read."));
    };
    reader.readAsDataURL(file);
  });
}

export async function buildContractUploadInput(
  input: File | BuildContractUploadInputArgs,
): Promise<ContractUploadInput> {
  if (isFileInput(input)) {
    const today = new Date();
    const fallbackExpiryDate = new Date(today);
    fallbackExpiryDate.setFullYear(fallbackExpiryDate.getFullYear() + 1);

    return {
      version: `v${today.getTime()}`,
      effectiveDate: toIsoDate(today),
      expiryDate: toIsoDate(fallbackExpiryDate),
      fileName: input.name,
      fileBase64: await readFileAsDataUrl(input),
    };
  }

  return {
    version: "v1.0",
    effectiveDate: toIsoEditableDate(input.effectiveDate),
    expiryDate: toIsoEditableDate(input.expiryDate),
    fileName: input.file.name,
    fileBase64: await readFileAsDataUrl(input.file),
  };
}
