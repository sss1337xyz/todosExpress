import prisma from "../../../../prisma/prisma.js";

export async function createTodo (parent, args)  {
    console.log(args)
    const newTodo = await prisma.todos.create({
        data: {
            title: args.title,
            description: args.description,
            ready: args.ready,
            userId: args.user.id
        }
    });

    return newTodo;
};

export async function deleteTodo (parent, args)  {
    const deleted = await prisma.todos.update({
        where: {
            id: args.id
        },
        data: {
            deletedAt: new Date()
        }
    });

    return deleted;
};

export async function setReadyTodo (parent, args)  {
    const updatedTodo = await prisma.todos.update({
        where: {
            id: args.id
        },
        data: {
            ready: args.ready
        }
    });

    return updatedTodo;
};