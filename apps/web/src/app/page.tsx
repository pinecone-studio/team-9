"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { EmployeeDashboard } from "@/components/employee-dashboard";
import { BenefitDetailModal } from "@/components/benefit-detail-modal";
import { HRDashboard } from "@/components/hr-dashboard";
import { HREmployees } from "@/components/hr-employees";
import { HRRequests } from "@/components/hr-requests";
import { HRRules } from "@/components/hr-rules";
import { HRAudit } from "@/components/hr-audit";
import { HRContracts } from "@/components/hr-contracts";
import { HRCatalog } from "@/components/hr-catalog";
import { HRNotifications } from "@/components/hr-notifications";
import { HRSettings } from "@/components/hr-settings";
import { BenefitCard } from "@/components/benefit-card";
import { getBenefitsByCategory } from "@/lib/rule-engine";

const categoryOrder = [
  "Wellness",
  "Equipment",
  "Financial",
  "Career Development",
  "Flexibility",
];

export default function Home() {
  const { currentUser, viewMode, setSelectedBenefitId } = useAppStore();
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderEmployeeContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <EmployeeDashboard />;
      case "benefits":
        if (!currentUser) return null;
        const benefitsByCategory = getBenefitsByCategory(currentUser);
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                My Benefits
              </h1>
              <p className="mt-1 text-muted-foreground">
                Browse and manage all available benefits
              </p>
            </div>
            {categoryOrder.map((category) => {
              const benefits = benefitsByCategory[category];
              if (!benefits || benefits.length === 0) return null;
              return (
                <div key={category}>
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    {category}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {benefits.map((benefit) => (
                      <BenefitCard
                        key={benefit.id}
                        benefit={benefit}
                        eligibility={benefit.eligibility}
                        onClick={() => setSelectedBenefitId(benefit.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      default:
        return <EmployeeDashboard />;
    }
  };

  const renderHRContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <HRDashboard onNavigate={setActiveTab} />;
      case "employees":
        return <HREmployees />;
      case "requests":
        return <HRRequests />;
      case "catalog":
        return <HRCatalog />;
      case "contracts":
        return <HRContracts />;
      case "rules":
        return <HRRules />;
      case "audit":
        return <HRAudit />;
      case "notifications":
        return <HRNotifications onNavigate={setActiveTab} />;
      case "settings":
        return <HRSettings />;
      default:
        return <HRDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar viewMode={viewMode} onNavigate={setActiveTab} />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl p-6 lg:p-8">
            {viewMode === "hr_admin"
              ? renderHRContent()
              : renderEmployeeContent()}
          </div>
        </main>
      </div>
      <BenefitDetailModal />
    </div>
  );
}
