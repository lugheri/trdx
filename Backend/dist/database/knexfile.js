"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
const dotenvFilePath = (0, path_1.resolve)(__dirname, '..', '..', '.env');
dotenv_1.default.config({ path: dotenvFilePath });
module.exports = {
    client: 'mysql2',
    connection: {
        database: process.env.DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: (0, path_1.resolve)(__dirname, 'migrations'),
    }
};
