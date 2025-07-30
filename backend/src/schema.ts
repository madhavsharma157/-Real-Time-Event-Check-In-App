export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
    events: [Event!]!
  }

  type Event {
    id: ID!
    name: String!
    description: String
    location: String!
    startTime: String!
    endTime: String
    imageUrl: String
    attendees: [User!]!
    attendeeCount: Int!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    register(name: String!, email: String!, password: String!): AuthPayload!
    joinEvent(eventId: ID!): Event!
    leaveEvent(eventId: ID!): Event!
  }

  type Subscription {
    eventUpdated(eventId: ID!): Event!
  }
`
