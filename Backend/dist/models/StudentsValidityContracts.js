"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsValidityContractsInstance = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.StudentsValidityContractsInstance = mysql_1.sequelize.define("StudentsValidityContracts", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: sequelize_1.DataTypes.TINYINT
    },
    payment_cycle: {
        type: sequelize_1.DataTypes.STRING
    },
    expired_in: {
        type: sequelize_1.DataTypes.DATE
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    tableName: "students_validity_contracts",
    timestamps: false
});
