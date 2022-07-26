export default `
  type User {
    id: ID!
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
    token:String!
    refreshToken:String!
    errors:[Error]
  }
  type LoginResponse {
    ok:Boolean!
    user:User
    token:String
    refreshToken:String
    errors:[Error]
  }
  type Mutation {
    register(username: String!, email: String!, password: String!): RegisterResponse
    login(email:String!,password:String!): LoginResponse
  }
`;
