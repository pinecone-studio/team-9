type Benefit = {
  id: string;
  title: string;
  description: string;
  category: string;
};

type Employee = {
  id: string;
  name: string;
  email: string;
  position: string;
  benefitIds: string[];
};

type EmployeeIdArgs = {
  id: string;
};

type AddEmployeeArgs = {
  name: string;
  email: string;
  position: string;
};

// Sample data
const employees: Employee[] = [
  { id: "1", name: "Sarah", email: "sarah@company.mn", position: "Assistant manager", benefitIds: ["b1", "b2"] },
  { id: "2", name: "Dean", email: "dean@company.mn", position: "Janitor", benefitIds: ["b1"] },
];

const benefits: Benefit[] = [
  { id: "b1", title: "Health insurance", description: "1000$", category: "Health" },
  { id: "b2", title: "Gym membership", description: "100$ per month", category: "Wellness" },
];

export const resolvers = {
  Query: {
    employees: () => employees,
    employee: (_: unknown, { id }: EmployeeIdArgs) => employees.find((e) => e.id === id),
    allBenefits: () => benefits,
  },

  // Relationship: map employee -> benefits
  Employee: {
    benefits: (parent: Employee) => {
      return benefits.filter((benefit) => parent.benefitIds.includes(benefit.id));
    },
  },

  Mutation: {
    addEmployee: (_: unknown, { name, email, position }: AddEmployeeArgs) => {
      const newEmployee = { id: String(employees.length + 1), name, email, position, benefitIds: [] };
      employees.push(newEmployee);
      return newEmployee;
    },
  },
};
