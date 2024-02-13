"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.json('Token not provided');
    try {
        const payload = jsonwebtoken_1.default.verify(authHeader, process.env.APP_SECRET);
        return next();
    }
    catch (err) {
        return res.json(false);
    }
};
