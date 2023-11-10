// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  # type Artist {
  #   id: Int
  #   name: String!
  #   spotify_id: String!
  #   href: String
  #   external_url: String
  #   albums: [Album!]
  # }
  # type Album {
  #   id: Int
  #   name: String!
  #   spotify_id: String!
  #   href: String
  #   artist_id: Int!
  #   release_date: String
  #   total_tracks: Int
  #   tracks: [Track!]
  #   artist: Artist!
  # }
  # type Track {
  #   id: Int
  #   name: String!
  #   album_id: Int!
  #   artist_id: Int!
  #   spotify_id: String!
  #   spotify_artist_id: String
  #   spotify_album_id: String
  #   external_url: String
  #   preview_url: String
  #   artist: Artist!
  #   album: Album!
  # }
  type Tasklist {
    id: Int!
    userId: String
    name: String # will be randomly generated if undefined
    description: String
    tasks: [Task]!
  }
  type Task {
    id: Int!
    tasklistName: String!
    title: String!
    label: String!
    priority: String!
    dueDate: String
    status: String!
    progress: Int!
    cursor: Int!
    subtasks: [Subtask!]!
  }
  type Subtask {
    id: Int!
    index: Int!
    taskId: Int!
    title: String!
    status: String!
    task: Task!
  }
  type Query {
    allTasklists: [Tasklist]!
    tasklists(names: [String]!): [Tasklist]!
    tasklist(name: String!): Tasklist
    allTasks: [Task]!
    tasks(tasklistName: String!): [Task]!
    task(id: Int!): Task
    subtasks(taskId: Int!): [Subtask]!
    subtask(id: Int!): Subtask
  }
  type Mutation {
    createTasklist(tasklist: AddTasklistInput!): Tasklist
    deleteTasklist(id: Int!): [Tasklist]
    updateTasklist(id: Int!, edits: EditTasklistInput!): Tasklist
    addTask(task: AddTaskInput!): Task
    deleteTask(id: Int!): [Task]
    updateTask(id: Int!, edits: EditTaskInput!): Task
    addSubtask(subtask: AddSubtaskInput!): Subtask
    deleteSubtask(id: Int!): [Subtask]
    updateSubtask(id: Int!, edits: EditSubtaskInput!): Subtask
    reorderSubtasks(subtaskId: Int!, newIndex: Int! ): [Subtask]
  }
  input AddTasklistInput {
    userId: Int
    name: String!
    description: String
  }
  input EditTasklistInput {
    name: String
    description: String
  }
  input AddTaskInput {
    tasklistName: String!
    title: String!
    label: String!
    priority: String!
    dueDate: String
  }
  input EditTaskInput {
    tasklistName: String
    title: String
    label: String
    priority: String
    dueDate: String
    status: String
    progress: Int
    cursor: Int
  }
  input AddSubtaskInput {
    taskId: Int!
    title: String!
  }
  input EditSubtaskInput {
    title: String
    status: String
  }
`;
