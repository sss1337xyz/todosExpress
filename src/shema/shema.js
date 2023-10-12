import prisma from "../../prisma/prisma.js";
import {createTodo, deleteTodo, setReadyTodo} from "./mutations/Todos/index.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {authenticateMiddleware} from "./middlewares/index.js";
import {login, register} from "./mutations/Authorization/index.js";
const saltRounds = 10;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Users {
      id: Int!,
      username: String!,
      password: String!
  }

  # This "Todos" type defines the queryable fields for every Todos in our data source.
  type Todos {
      id: Int!,
      title: String!,
      description: String,
      ready: Boolean!,
      createdAt: DateTime!,
      deletedAt: DateTime,
      userId: Int!
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
      setReadyTodo(id: Int!, ready: Boolean!): Todos,

      login(username: String!, password: String!): LoginResponse!
      register(username: String!, password: String!): Users,
  }

  input TodoFilter {
      deletedAt: Boolean,
      limit: Int,
      offset: Int
  }

  type LoginResponse {
    token: String!
  }

  # The "DateTime" scalar type represents a 
  scalar DateTime
`;

export const resolvers = {
    Query: {
        allTodos: async ( parent, args, contextValue) => {
            const filter = args.filter || {};

            const todos = await prisma.todos.findMany({
                take: filter.limit,
                skip: filter.offset,
                where: {
                    userId: args.user.id,
                    deletedAt: filter.deletedAt === true ? undefined : null,
                }
            })

            return todos;
        },
    },
    Mutation: {
        createTodo: createTodo,
        deleteTodo: deleteTodo,
        setReadyTodo: setReadyTodo,
        register: register,
        login: login
    }
};