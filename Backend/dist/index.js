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
const routes_1 = __importDefault(require("./routes/routes"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const multer_1 = require("multer");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '250mb' }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.urlencoded({ extended: true, limit: '250mb' }));
app.use(routes_1.default);
const errorHandler = (err, req, res, next) => {
    res.status(400);
    if (err instanceof multer_1.MulterError) {
        res.json({ error: err.code });
    }
    else {
        console.error(err);
        res.json({ error: 'Ocorreu algum erro' });
    }
};
app.use(errorHandler);
const httpServer = http_1.default.createServer(app);
const startUp = () => __awaiter(void 0, void 0, void 0, function* () {
    httpServer.listen(4000, () => console.info('😀 Backend Platform v4 - online!'));
});
startUp();
