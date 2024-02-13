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
exports.down = exports.up = void 0;
const ETablesNames_1 = require("../ETablesNames");
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex
            .schema
            .createTable(ETablesNames_1.ETableNames.users, (table) => {
            table.increments('id').primary();
            table.integer('photo');
            table.string('name', 75).notNullable();
            table.string('mail', 75).notNullable();
            table.integer('level');
            table.string('password', 50).notNullable();
            table.tinyint('reset');
            table.tinyint('status');
            table.timestamps(true, true);
        })
            .then(() => {
            console.info(`# Table ${ETablesNames_1.ETableNames.users} created successfully!`);
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex
            .schema
            .dropTable(ETablesNames_1.ETableNames.users)
            .then(() => {
            console.info(`# Table ${ETablesNames_1.ETableNames.users} dropped successfully!`);
        });
    });
}
exports.down = down;
