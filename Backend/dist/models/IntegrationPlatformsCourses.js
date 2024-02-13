"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationPlatformsCourses = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.IntegrationPlatformsCourses = mysql_1.sequelize.define("IntegrationPlatformsCoursesInstance", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    offer_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    course_id_students: {
        type: sequelize_1.DataTypes.INTEGER
    },
    validity_contract: {
        type: sequelize_1.DataTypes.STRING,
    }
}, {
    tableName: "integration_platforms_courses",
    timestamps: false
});
