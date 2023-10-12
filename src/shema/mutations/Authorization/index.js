import prisma from "../../../../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register (parent, args) {
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
};

export async function login (parent, args) {
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
}