export default `
  type User {
    id: Int!
    username: String!
    email: String
    password:String!
  }
  type Query {
    getUser(id: Int!): User!
    allUsers: [User!]!
  }
  type Error {
    key:String!
    message:String!
  }
  type RegisterResponse {
    ok:Boolean!
    errors:[Error]
  }
  type LoginResponse {
    ok:Boolean!
    token:String!
    refreshToken:String!
  }
  type Mutation {
    register(username: String!, email: String!, password: String!): RegisterResponse
    login(email:String!,password:String!): LoginResponse
  }
`;
