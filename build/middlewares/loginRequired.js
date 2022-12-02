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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            errors: ['Login required']
        });
    }
    const [, token] = authorization.split(' ');
    try {
        const data = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        const { id, name } = data;
        const user = yield prisma.user.findFirst({
            where: {
                id,
                name
            }
        });
        if (!user) {
            return res.status(401).json({
                errors: ['Invalid User']
            });
        }
        return next();
    }
    catch (error) {
        return res.status(401).json({
            errors: ['Token expired or invalid']
        });
    }
});
