"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkActionStudents = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.BulkActionStudents = mysql_1.sequelize.define("BulkActionStudents", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
}, {
    tableName: "bulkaction_students",
    timestamps: false
});
