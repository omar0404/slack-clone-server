export default `
  type Message {
    id:Int!
    user:User!
    text:String!
  }
  type Mutation {
    createMessage(userId:Int!,text:String!):Boolean!
  }

`;