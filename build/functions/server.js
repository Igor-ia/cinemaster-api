"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const movieRoute_1 = __importDefault(require("../routes/movieRoute"));
const loginRoute_1 = __importDefault(require("../routes/loginRoute"));
const favoriteRoute_1 = __importDefault(require("../routes/favoriteRoute"));
const dislikeRoute_1 = __importDefault(require("../routes/dislikeRoute"));
//Express configuration
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//Routes
app.use('/movies', movieRoute_1.default);
app.use('/login', loginRoute_1.default);
app.use('/favorites', favoriteRoute_1.default);
app.use('/dislike', dislikeRoute_1.default);
// app.listen(3333);
module.exports.handler = (0, serverless_http_1.default)(app);
