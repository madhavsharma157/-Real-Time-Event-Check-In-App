import { gql } from "@apollo/client"

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      name
      description
      location
      startTime
      endTime
      imageUrl
      attendeeCount
      attendees {
        id
        name
        avatar
      }
    }
  }
`

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      description
      location
      startTime
      endTime
      imageUrl
      attendeeCount
      attendees {
        id
        name
        avatar
      }
    }
  }
`

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      avatar
    }
  }
`
