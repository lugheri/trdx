"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsLogins = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.StudentsLogins = mysql_1.sequelize.define("StudentsLogins", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    date: {
        type: sequelize_1.DataTypes.DATE
    },
    hour: {
        type: sequelize_1.DataTypes.TIME
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    action: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    tableName: "students_logins",
    timestamps: false
});
