import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { string, z } from 'zod';

const RegisterSchema = z.object({
    email: z.string().email('Email is invalid'),
    name: z.string().min(1, { message: "Name is required" }),
    password: z.string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(20, { message: 'Password must be a max of 20 characters ' }),
});

const LoginSchema = z.object({
    email: z.string().email('Email is invalid'),
    password: z.string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(20, { message: 'Password must be a max of 20 characters' }),
});


const prisma = new PrismaClient();

export async function register(req: any, res: any) {
    try {

        const data = RegisterSchema.parse(req.body);

        const userCount = await prisma.user.findFirst({
            where: { email: data.email }
        });

        if (userCount) {
            return res.status(400).json({ errors: ["User exists"] });
        }


        data.password = await bcryptjs.hash(data.password, 8);
        const user = await prisma.user.create({
            data
        });

        return res.status(201).json(user)
    } catch (e: any) {
        const issues = e.issues;

        res.status(400).json({
            errors: issues.map((err: any) => err.message)
        })

    }
}

export async function loginToken(req: any, res: any) {
    try {

        const data = LoginSchema.parse(req.body);

        const user = await prisma.user.findFirst({
            where: {
                email: data.email
            }
        });

        if (!user) {

            return res.status(400).json({ errors: ["User don't exists"] });
        }

        if (!(await bcryptjs.compare(data.password, user.password))) {
            return res.status(400).json({ errors: ["Password is invalid"] });
        }

        const { id, name } = user;

        const token = jwt.sign({ id, name }, process.env.TOKEN_SECRET as string, {
            expiresIn: process.env.TOKEN_EXPIRATION
        });

        return res.status(200).json({ token, user: { id, name } })
    } catch (e: any) {
        const issues = e.issues;

        return res.status(400).json({
            errors: issues.map((err: any) => err.message)
        });

    }
}