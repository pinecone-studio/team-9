import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Benefit = {
  __typename?: 'Benefit';
  category: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type BenefitEligibility = {
  __typename?: 'BenefitEligibility';
  benefit: Benefit;
  computedAt: Scalars['String']['output'];
  ruleEvaluationJson: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type Employee = {
  __typename?: 'Employee';
  benefits?: Maybe<Array<Maybe<Benefit>>>;
  department: Scalars['String']['output'];
  email: Scalars['String']['output'];
  employmentStatus: Scalars['String']['output'];
  hireDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  position: Scalars['String']['output'];
  responsibilityLevel: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createEmployee?: Maybe<Employee>;
  recalculateEmployeeEligibility: Array<BenefitEligibility>;
};


export type MutationCreateEmployeeArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  position: Scalars['String']['input'];
};


export type MutationRecalculateEmployeeEligibilityArgs = {
  employeeId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  allBenefits: Array<Benefit>;
  employee?: Maybe<Employee>;
  employeeEligibility: Array<BenefitEligibility>;
  employees: Array<Employee>;
};


export type QueryEmployeeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEmployeeEligibilityArgs = {
  employeeId: Scalars['ID']['input'];
};

export type EmployeesPageQueryVariables = Exact<{ [key: string]: never; }>;


export type EmployeesPageQuery = { __typename?: 'Query', employees: Array<{ __typename?: 'Employee', id: string, name: string, email: string, position: string, department: string, employmentStatus: string, hireDate: string, responsibilityLevel: number }> };

export type EmployeeEligibilityQueryVariables = Exact<{
  employeeId: Scalars['ID']['input'];
}>;


export type EmployeeEligibilityQuery = { __typename?: 'Query', employeeEligibility: Array<{ __typename?: 'BenefitEligibility', status: string, computedAt: string, benefit: { __typename?: 'Benefit', id: string, title: string, category: string } }> };

export type RecalculateEmployeeEligibilityMutationVariables = Exact<{
  employeeId: Scalars['ID']['input'];
}>;


export type RecalculateEmployeeEligibilityMutation = { __typename?: 'Mutation', recalculateEmployeeEligibility: Array<{ __typename?: 'BenefitEligibility', status: string, computedAt: string, benefit: { __typename?: 'Benefit', id: string, title: string, category: string } }> };


export const EmployeesPageDocument = gql`
    query EmployeesPage {
  employees {
    id
    name
    email
    position
    department
    employmentStatus
    hireDate
    responsibilityLevel
  }
}
    ` as unknown as DocumentNode<EmployeesPageQuery, EmployeesPageQueryVariables>;
export const EmployeeEligibilityDocument = gql`
    query EmployeeEligibility($employeeId: ID!) {
  employeeEligibility(employeeId: $employeeId) {
    status
    computedAt
    benefit {
      id
      title
      category
    }
  }
}
    ` as unknown as DocumentNode<EmployeeEligibilityQuery, EmployeeEligibilityQueryVariables>;
export const RecalculateEmployeeEligibilityDocument = gql`
    mutation RecalculateEmployeeEligibility($employeeId: ID!) {
  recalculateEmployeeEligibility(employeeId: $employeeId) {
    status
    computedAt
    benefit {
      id
      title
      category
    }
  }
}
    ` as unknown as DocumentNode<RecalculateEmployeeEligibilityMutation, RecalculateEmployeeEligibilityMutationVariables>;