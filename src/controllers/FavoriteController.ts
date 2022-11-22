import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function index(req: any, res: any) {


    const { userId } = req.params;

    if (!userId) return;

    const favorites = await prisma.favoritedMovie.findMany({
        where: {
            userId
        },
        select: {
            movie: true,
            movieId: true,
            user: false,
            userId: false
        }
    })
    res.status(200).json(favorites)
}
export async function favorite(req: any, res: any) {
    const { userId } = req.body;

    if (!userId) return;

    const movieId = req.params.id;

    await prisma.favoritedMovie.create({
        data: {
            movieId,
            userId
        }
    })

    return res.status(200)
}