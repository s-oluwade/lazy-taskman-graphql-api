// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  type Employee {
    id: Int!
    employeeName: String!
    department: String!
    phone: Int
    job: String
    sex: String!
    hireDate: String
  }

  type Department {
    id: Int!
    deptNo: String!
    deptName: String!
  }

  type Query {
    employees: [Employee]
    departments: [Department]
    employee(id: Int!): Employee
    department(id: Int!): Department
  }
`;