import { gql } from "@apollo/client";

export const CONTRACTS_LAST_SEEN_KEY = "hr_contracts_last_seen_at";

export const ContractsNavActivityDocument = gql`
  query ContractsNavActivity {
    listAuditLogEntries {
      id
      entityType
      action
      metadata
      createdAt
    }
  }
`;

export type ContractsNavActivityEntry = {
  action: string;
  createdAt: string;
  entityType: string;
  id: string;
  metadata?: string | null;
};

export type ContractsNavActivityData = {
  listAuditLogEntries: ContractsNavActivityEntry[];
};

export function isContractRelatedActivity(entry: ContractsNavActivityEntry) {
  const searchableText = `${entry.entityType} ${entry.action} ${entry.metadata ?? ""}`;
  return /contract/i.test(searchableText);
}

export function getStoredContractsLastSeenAt() {
  if (typeof window === "undefined") {
    return 0;
  }

  const parsedValue = Number(window.localStorage.getItem(CONTRACTS_LAST_SEEN_KEY));
  return !Number.isNaN(parsedValue) && parsedValue > 0 ? parsedValue : 0;
}

export function storeContractsLastSeenAt(value: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CONTRACTS_LAST_SEEN_KEY, String(value));
}
