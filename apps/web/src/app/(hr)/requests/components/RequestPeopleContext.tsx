"use client";

import { createContext, useContext } from "react";

import { formatPersonLabel } from "./approval-request-utils";

export type RequestPerson = {
  name: string;
  position: string | null;
};

const RequestPeopleContext = createContext<Record<string, RequestPerson>>({});

export function RequestPeopleProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Record<string, RequestPerson>;
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
  people: Record<string, RequestPerson>,
  value: string | null | undefined,
) {
  if (!value) {
    return "-";
  }

  return people[value.trim().toLowerCase()]?.name ?? formatPersonLabel(value);
}

export function resolveRequestPerson(
  people: Record<string, RequestPerson>,
  value: string | null | undefined,
) {
  if (!value) {
    return null;
  }

  const key = value.trim().toLowerCase();
  const person = people[key];

  if (person) {
    return person;
  }

  return {
    name: formatPersonLabel(value),
    position: null,
  };
}

export function useResolvedPersonName(value: string | null | undefined) {
  const people = useRequestPeople();
  return resolveRequestPersonName(people, value);
}
