import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();


export async function dislike(req: any, res: any) {
    const { userId } = req.body;

    if (!userId) return;

    const movieId = req.params.id;

    await prisma.favoritedMovie.delete({
        where: {
            userId_movieId: {
                movieId,
                userId
            }
        }
    })
}