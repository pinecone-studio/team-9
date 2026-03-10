export const typeDefs = /* GraphQL */ `
  type Employee {
    id: ID!
    name: String!
    position: String!
    email: String!
    benefits: [Benefit]
  }

  type Benefit {
    id: ID!
    title: String!
    description: String!
    category: String! # Жишээ нь: Эрүүл мэнд, Хоол, Даатгал
  }

  type Query {
    # Бүх ажилчдыг авах
    employees: [Employee]
    # Нэг ажилтны мэдээллийг ID-аар авах
    employee(id: ID!): Employee
    # Бүх боломжит хөнгөлөлтүүдийг харах
    allBenefits: [Benefit]
  }

  type Mutation {
    # Шинэ ажилтан нэмэх
    addEmployee(name: String!, email: String!, position: String!): Employee
  }
`;