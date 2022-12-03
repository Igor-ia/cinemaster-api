import { PrismaClient } from '@prisma/client'
import { z } from 'zod';

const MovieSchema = z.object({
    creatorId: z.string(),
    title: z.string().min(1, { message: 'Movie Title is required' }),
    synopsis: z.string().min(1, { message: 'Movie Synopsis is required' }),
    rate: z.string().min(1, { message: 'Movie Rate is required' }),
    poster: z.string().min(1, { message: 'Movie Poster is required' }),
});


const prisma = new PrismaClient();

export async function index(req: any, res: any) {
    const movies = await prisma.movie.findMany();
    res.status(200).json(movies);
}

export async function show(req: any, res: any) {

    const creatorId = req.params.id;

    if (!creatorId) return;


    const added = await prisma.movie.findMany({
        where: { creatorId }
    })

    res.status(200).json(added);


}

export async function search(req: any, res: any) {
    const textSearch = req.params.text;

    if (!textSearch) return;

    const movies = await prisma.movie.findMany({
        where: {
            title: {
                contains: textSearch
            }
        }
    });

    res.status(200).json(movies);
}

export async function store(req: any, res: any) {
    try {

        const data = MovieSchema.parse(req.body);

        if (!(data.creatorId)) return;

        const movie = await prisma.movie.create({
            data
        });

        return res.status(200).json(movie);
    } catch (e: any) {
        const issues = e.issues;

        return res.status(400).json({
            errors: issues.map((err: any) => err.message)
        })

    }
}