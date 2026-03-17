"use client";

import { EmployeeContent } from "./EmployeeContent";
import { useEmployeeDashboardViewData } from "./useEmployeeDashboardViewData";

type EmployeeDashboardClientProps = {
  currentUserIdentifier: string;
  employeeEmail: string | null;
  employeeId: string;
  employeeLateArrivals30Days: number | null;
  employeeName: string;
  employeeOkrSubmitted: boolean | null;
  employeeResponsibilityLevel: number | null;
  employmentStatus: string;
};

export function EmployeeDashboardClient({
  currentUserIdentifier,
  employeeEmail,
  employeeId,
  employeeLateArrivals30Days,
  employeeName,
  employeeOkrSubmitted,
  employeeResponsibilityLevel,
  employmentStatus,
}: EmployeeDashboardClientProps) {
  const { dashboardData, errorMessage, isLoading } = useEmployeeDashboardViewData({
    employeeEmail,
    employeeId,
    employeeLateArrivals30Days,
    employeeName,
    employeeOkrSubmitted,
    employeeResponsibilityLevel,
    employmentStatus,
  });

  return (
    <EmployeeContent
      currentUserIdentifier={currentUserIdentifier}
      dashboardData={dashboardData}
      employeeId={employeeId}
      employeeName={employeeName}
      errorMessage={errorMessage}
      isLoading={isLoading}
    />
  );
}
