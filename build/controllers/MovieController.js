"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.search = exports.show = exports.index = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const MovieSchema = zod_1.z.object({
    creatorId: zod_1.z.string(),
    title: zod_1.z.string().min(1, { message: 'Movie Title is required' }),
    synopsis: zod_1.z.string().min(1, { message: 'Movie Synopsis is required' }),
    rate: zod_1.z.string().min(1, { message: 'Movie Rate is required' }),
    poster: zod_1.z.string().min(1, { message: 'Movie Poster is required' }),
});
const prisma = new client_1.PrismaClient();
function index(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const movies = yield prisma.movie.findMany();
        res.status(200).json(movies);
    });
}
exports.index = index;
function show(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const creatorId = req.params.id;
        if (!creatorId)
            return;
        const added = yield prisma.movie.findMany({
            where: { creatorId }
        });
        res.status(200).json(added);
    });
}
exports.show = show;
function search(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const textSearch = req.params.text;
        if (!textSearch)
            return;
        const movies = yield prisma.movie.findMany({
            where: {
                title: {
                    contains: textSearch
                }
            }
        });
        res.status(200).json(movies);
    });
}
exports.search = search;
function store(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = MovieSchema.parse(req.body);
            if (!(data.creatorId))
                return;
            const movie = yield prisma.movie.create({
                data
            });
            return res.status(200).json(movie);
        }
        catch (e) {
            const issues = e.issues;
            return res.status(400).json({
                errors: issues.map((err) => err.message)
            });
        }
    });
}
exports.store = store;
