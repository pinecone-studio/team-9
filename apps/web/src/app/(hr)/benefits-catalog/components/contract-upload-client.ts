export type ContractUploadInput = {
  effectiveDate: string;
  expiryDate: string;
  fileBase64: string;
  fileName: string;
  version: string;
};

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

export async function buildContractUploadInput(file: File): Promise<ContractUploadInput> {
  const today = new Date();
  const expiryDate = new Date(today);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  return {
    version: `v${today.getTime()}`,
    effectiveDate: toIsoDate(today),
    expiryDate: toIsoDate(expiryDate),
    fileName: file.name,
    fileBase64: await readFileAsDataUrl(file),
  };
}
