"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesValidityContracts = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.CoursesValidityContracts = mysql_1.sequelize.define('CoursesValidityContracts', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    course_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    start_validity: {
        type: sequelize_1.DataTypes.DATE
    },
    end_validity: {
        type: sequelize_1.DataTypes.DATE
    },
    payment_cycle: {
        type: sequelize_1.DataTypes.STRING
    },
    expire: {
        type: sequelize_1.DataTypes.INTEGER
    },
    lifetime: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: 'courses_validity_contracts',
    timestamps: false
});
