"use client";

import type { ReactElement, SVGProps } from "react";

type EmployeesHeroSectionProps = {
  eligibleEmployees: number;
  probationEmployees: number;
  totalEmployees: number;
  weeklyOverrides: number;
};

type EmployeesHeroCardProps = {
  icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  iconClassName: string;
  subtitle: string;
  title: string;
  value: string;
};

function PeopleAltIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 22 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M15.67 9.13C17.04 10.06 18 11.32 18 13V16H22V13C22 10.82 18.43 9.53 15.67 9.13Z"
        fill="currentColor"
      />
      <path
        d="M14 8C16.21 8 18 6.21 18 4C18 1.79 16.21 0 14 0C13.53 0 13.09 0.1 12.67 0.24C13.5 1.27 14 2.58 14 4C14 5.42 13.5 6.73 12.67 7.76C13.09 7.9 13.53 8 14 8Z"
        fill="currentColor"
      />
      <path
        d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 2C9.1 2 10 2.9 10 4C10 5.1 9.1 6 8 6C6.9 6 6 5.1 6 4C6 2.9 6.9 2 8 2Z"
        fill="currentColor"
      />
      <path
        d="M8 9C5.33 9 0 10.34 0 13V16H16V13C16 10.34 10.67 9 8 9ZM14 14H2V13.01C2.2 12.29 5.3 11 8 11C10.7 11 13.8 12.29 14 13V14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckCircleOutlineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM14.59 5.58L8 12.17L5.41 9.59L4 11L8 15L16 7L14.59 5.58Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HourglassEmptyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 12 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M0 0V6H0.01L0 6.01L4 10L0 14L0.01 14.01H0V20H12V14.01H11.99L12 14L8 10L12 6.01L11.99 6H12V0H0ZM10 14.5V18H2V14.5L6 10.5L10 14.5ZM6 9.5L2 5.5V2H10V5.5L6 9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 0L0 3V9.09C0 14.14 3.41 18.85 8 20C12.59 18.85 16 14.14 16 9.09V3L8 0ZM14 9.09C14 13.09 11.45 16.79 8 17.92C4.55 16.79 2 13.1 2 9.09V4.39L8 2.14L14 4.39V9.09Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EmployeesHeroCard({
  icon: Icon,
  iconClassName,
  subtitle,
  title,
  value,
}: EmployeesHeroCardProps) {
  return (
    <article className="flex min-h-[160px] w-full flex-col justify-center gap-4 rounded-[8px] border border-white/12 bg-[rgba(0,0,0,0.1)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[4px]">
      <div className="flex w-full items-center gap-1.5 text-white">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center">
          <Icon className={iconClassName} />
        </span>
        <p className="text-[14px] leading-5 font-medium text-white">{title}</p>
      </div>

      <div className="flex w-full flex-col items-start gap-1">
        <p className="text-[40px] leading-[36px] font-bold text-white">{value}</p>
        <p className="text-[12px] leading-4 font-medium text-white">{subtitle}</p>
      </div>
    </article>
  );
}

export default function EmployeesHeroSection({
  eligibleEmployees,
  probationEmployees,
  totalEmployees,
  weeklyOverrides,
}: EmployeesHeroSectionProps) {
  const heroCards: EmployeesHeroCardProps[] = [
    {
      icon: PeopleAltIcon,
      iconClassName: "h-4 w-[22px] text-white",
      subtitle: "Employees in system",
      title: "Total Employees",
      value: String(totalEmployees),
    },
    {
      icon: CheckCircleOutlineIcon,
      iconClassName: "h-5 w-5 text-white",
      subtitle: "Eligible for standard benefit rules",
      title: "Eligible for Benefits",
      value: String(eligibleEmployees),
    },
    {
      icon: HourglassEmptyIcon,
      iconClassName: "h-5 w-3 text-white",
      subtitle: "Currently in probation period",
      title: "On Probation",
      value: String(probationEmployees),
    },
    {
      icon: ShieldIcon,
      iconClassName: "h-5 w-4 text-white",
      subtitle: "Eligibility overrides this week",
      title: "Override Flags",
      value: String(weeklyOverrides),
    },
  ];

  return (
    <section className="relative flex min-h-[340px] w-full flex-col justify-between overflow-hidden rounded-[16px] px-[30px] py-[50px]">
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/employees-hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,57,142,0.18),rgba(12,26,88,0.42))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.2),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />

      <div className="relative flex flex-1 flex-col items-center justify-between gap-10">
        <div className="flex w-full max-w-[560px] flex-col items-center gap-[5px] text-center">
          <h1 className="w-full text-[24px] leading-[31px] font-semibold text-white">
            Employees
          </h1>
          <p className="w-full text-[14px] leading-[18px] font-normal text-white">
            Manage employee benefits and eligibility
          </p>
        </div>

        <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-4">
          {heroCards.map((card) => (
            <EmployeesHeroCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
