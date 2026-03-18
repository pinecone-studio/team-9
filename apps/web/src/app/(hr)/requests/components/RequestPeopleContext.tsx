"use client";

import { createContext, useContext } from "react";

import { formatPersonLabel } from "./approval-request-utils";

const RequestPeopleContext = createContext<Record<string, string>>({});

export function RequestPeopleProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Record<string, string>;
}) {
  return (
    <RequestPeopleContext.Provider value={value}>
      {children}
    </RequestPeopleContext.Provider>
  );
}

export function useRequestPeople() {
  return useContext(RequestPeopleContext);
}

export function resolveRequestPersonName(
  people: Record<string, string>,
  value: string | null | undefined,
) {
  if (!value) {
    return "-";
  }

  return people[value.trim().toLowerCase()] ?? formatPersonLabel(value);
}

export function useResolvedPersonName(value: string | null | undefined) {
  const people = useRequestPeople();
  return resolveRequestPersonName(people, value);
}
