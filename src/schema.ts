// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  type Artist {
    id: Int
    name: String!
    spotify_id: String!
    href: String
    external_url: String
    albums: [Album!]
  }

  type Album {
    id: Int
    name: String!
    spotify_id: String!
    href: String
    artist_id: Int!
    release_date: String
    total_tracks: Int
    tracks: [Track!]
    artist: Artist!
  }

  type Track {
    id: Int
    name: String!
    album_id: Int!
    artist_id: Int!
    spotify_id: String!
    spotify_artist_id: String
    spotify_album_id: String
    external_url: String
    preview_url: String
    artist: Artist!
    album: Album!
  }

  type Query {
    # employees: [Employee]
    # departments: [Department]
    # employee(id: Int!): Employee
    # department(id: Int!): Department
    artists: [Artist]
    artist(id: Int!): Artist
    albums: [Album]
    album(id: Int!): Album
    tracks: [Track]
    track(id: Int!): Track
  }
`;
