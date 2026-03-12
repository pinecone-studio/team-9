"use client";

import { useState } from "react";

import EmployeeRequestCard from "./EmployeeRequestCard";
import RequestStatusTabs from "./RequestStatusTabs";

export default function RequestsBoard() {
  const [activeTab, setActiveTab] = useState<"pending" | "processed">("pending");

  return (
    <>
      <RequestStatusTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "pending" ? (
        <section className="mt-[49px] flex flex-col gap-7">
          <EmployeeRequestCard
            benefit="Gym Membership"
            initials="SC"
            name="Sarah Chen"
            submittedLabel="Submitted 2 days ago"
          />
          <EmployeeRequestCard
            benefit="Gym Membership"
            initials="SC"
            name="Sarah Chen"
            submittedLabel="Submitted 2 days ago"
          />
        </section>
      ) : (
        <section className="mt-[49px] flex flex-col gap-7">
          <EmployeeRequestCard
            benefit="Ux Tools"
            initials="MJ"
            name="Marcus Johnson"
            status="processed"
            submittedLabel="Submitted 6 days ago"
          />
          <EmployeeRequestCard
            benefit="Ux Tools"
            initials="MJ"
            name="Marcus Johnson"
            status="processed"
            submittedLabel="Submitted 6 days ago"
          />
          <EmployeeRequestCard
            benefit="Gym Membership"
            initials="SC"
            name="Sarah Chen"
            status="rejected"
            submittedLabel="Submitted 2 days ago"
          />
        </section>
      )}
    </>
  );
}
