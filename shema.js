import prisma from "./prisma/prisma.js";


export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Todos {
      id: Int!,
      title: String!,
      description: String,
      ready: Boolean!,
      createdAt: DateTime!,
      deletedAt: DateTime
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    allTodos(filter: TodoFilter): [Todos]
  }

  # The "Mutation" type defines the mutation
  type Mutation {
      createTodo(title: String!, description: String, ready: Boolean): Todos,
      deleteTodo(id: Int!): Todos,
      setReadyTodo(id: Int!, ready: Boolean!): Todos
  }

  input TodoFilter {
      deletedAt: Boolean
  }

  # The "DateTime" scalar type represents a 
  scalar DateTime
`;

export const resolvers = {
    Query: {
        allTodos: async (parent, args) => {
            const filter = args.filter || {};

            const todos = await prisma.todos.findMany({
                where: {
                    deletedAt: filter.deletedAt === true ? undefined : null,
                }
            })

            return todos;
        },
    },
    Mutation: {
        createTodo: async (parent, args) => {
            const newTodo = await prisma.todos.create({
                data: {
                    title: args.title,
                    description: args.description,
                    ready: args.ready
                }
            });

            return newTodo;
        },
        deleteTodo: async (parent, args) => {
            const deleted = await prisma.todos.update({
                where: {
                    id: args.id
                },
                data: {
                    deletedAt: new Date()
                }
            });

            return deleted;
        },
        setReadyTodo: async (parent, args) => {
            const updatedTodo = await prisma.todos.update({
                where: {
                    id: args.id
                },
                data: {
                    ready: args.ready
                }
            });

            return updatedTodo;
        }
    }
};