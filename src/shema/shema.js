import prisma from "../../prisma/prisma.js";
import {createTodo, deleteTodo, setReadyTodo} from "./mutations/Todos/index.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../../config.js";
const saltRounds = 10;


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
      setReadyTodo(id: Int!, ready: Boolean!): Todos,

      login(username: String!, password: String!): LoginResponse!
      register(username: String!, password: String!): Users,
  }

  input TodoFilter {
      deletedAt: Boolean
  }

  type LoginResponse {
    token: String!
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
        createTodo: createTodo,
        deleteTodo: deleteTodo,
        setReadyTodo: setReadyTodo,
        register: async (parent, args) => {
            try {
                const user = await prisma.user.findFirst({
                    where: {
                        username: args.username,
                    }
                });

                if (!user) {
                    const hashedPassword = await bcrypt.hash(args.password, saltRounds);
                    const user = await prisma.user.create({
                        data: {
                            username: args.username,
                            password: hashedPassword
                        }
                    });
                    return user;
                }else {
                    throw new Error("Пользователь уже существует");
                }
            } catch (error) {
                // Обработка ошибки bcrypt.hash
                console.error(error);
                //throw new Error("Ошибка при хешировании пароля");
            }
        },
        login: async (parent, args) => {
            const user = await prisma.user.findFirst({
                where: {
                    username: args.username,
                }
            });

            const validPassword = await bcrypt.compare(args.password, user.password);
            if(!validPassword) {
                throw new Error("Неверный пароль");
            }
            const payload = {
                id: user.id,
                username: user.username
            }
            const token = jwt.sign(payload, JWT_SECRET_KEY);

            return {
                token: token
            }
        },
    }
};