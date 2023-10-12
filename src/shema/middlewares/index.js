import jwt from 'jsonwebtoken';
import prisma from "../../../prisma/prisma.js";
import {GraphQLError} from "graphql/error/index.js";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const authenticateMiddleware = async ( resolve, parent, args, context, info) => {
    // You can use middleware to override arguments
    try {
        const token = context.headers.authorization.split(' ')[1];
        if(!token){
            throw new GraphQLError('Need auth token')
        }

        const {id, username} = jwt.verify(token, JWT_SECRET_KEY);
        if(!id || !username){
            throw new GraphQLError('User not found');
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                username
            }
        });

        if(user){
            const result = await resolve(parent, {...args, user}, context, info)
            // Or change the returned values of resolvers
            return result;
        }else{
            throw new GraphQLError('User not found');
        }
    }catch (e) {
        throw new GraphQLError(e);

    }
};

export const Middleware = {
    Query: {
        allTodos: authenticateMiddleware,
    },
    Mutation: {
        createTodo: authenticateMiddleware,
        deleteTodo: authenticateMiddleware,
        setReadyTodo: authenticateMiddleware
    }
}

export default { authenticateMiddleware, Middleware}
