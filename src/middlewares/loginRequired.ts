import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();

interface JwtPayloadProps {
    id: string;
    name: string;
}

export default async (req: any, res: any, next: any) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            errors: ['Login required']
        })
    }

    const [, token] = authorization.split(' ');

    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayloadProps;
        const { id, name } = data;

        const user = await prisma.user.findFirst({
            where: {
                id,
                name
            }
        });

        if (!user) {
            return res.status(401).json({
                errors: ['Invalid User']
            })
        }
        return next();
    } catch (error) {
        return res.status(401).json({
            errors: ['Token expired or invalid']
        })
    }
}