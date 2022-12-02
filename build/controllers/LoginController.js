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
exports.loginToken = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const RegisterSchema = zod_1.z.object({
    id: (0, zod_1.string)(),
    email: zod_1.z.string().email('Email is invalid'),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    password: zod_1.z.string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(20, { message: 'Password must be a max of 20 characters ' }),
});
const LoginSchema = zod_1.z.object({
    id: (0, zod_1.string)(),
    email: zod_1.z.string().email('Email is invalid'),
    password: zod_1.z.string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(20, { message: 'Password must be a max of 20 characters' }),
});
const prisma = new client_1.PrismaClient();
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = RegisterSchema.parse(req.body);
            const userCount = yield prisma.user.findFirst({
                where: { email: data.email }
            });
            if (userCount) {
                return res.status(400).json({ errors: ["User exists"] });
            }
            data.password = yield bcryptjs_1.default.hash(data.password, 8);
            const user = yield prisma.user.create({
                data
            });
            return res.status(201).json(user);
        }
        catch (e) {
            const issues = e.issues;
            res.status(400).json({
                errors: issues.map((err) => err.message)
            });
        }
    });
}
exports.register = register;
function loginToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = LoginSchema.parse(req.body);
            const user = yield prisma.user.findFirst({
                where: {
                    email: data.email
                }
            });
            if (!user) {
                return res.status(400).json({ errors: ["User don't exists"] });
            }
            if (!(yield bcryptjs_1.default.compare(data.password, user.password))) {
                return res.status(400).json({ errors: ["Password is invalid"] });
            }
            const { id, name } = user;
            const token = jsonwebtoken_1.default.sign({ id, name }, process.env.TOKEN_SECRET, {
                expiresIn: process.env.TOKEN_EXPIRATION
            });
            return res.status(200).json({ token, user: { id, name } });
        }
        catch (e) {
            const issues = e.issues;
            return res.status(400).json({
                errors: issues.map((err) => err.message)
            });
        }
    });
}
exports.loginToken = loginToken;
