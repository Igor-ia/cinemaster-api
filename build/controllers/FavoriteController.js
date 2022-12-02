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
exports.favorite = exports.index = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function index(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        if (!userId)
            return;
        const favorites = yield prisma.favoritedMovie.findMany({
            where: {
                userId
            },
            select: {
                movie: true,
                movieId: true,
                user: false,
                userId: false
            }
        });
        res.status(200).json(favorites);
    });
}
exports.index = index;
function favorite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        if (!userId)
            return;
        const movieId = req.params.id;
        yield prisma.favoritedMovie.create({
            data: {
                movieId,
                userId
            }
        });
        return res.status(200);
    });
}
exports.favorite = favorite;
