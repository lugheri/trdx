"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Courses = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
const StudentsCourses_1 = require("./StudentsCourses");
exports.Courses = mysql_1.sequelize.define("Courses", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE
    },
    image: {
        type: sequelize_1.DataTypes.INTEGER
    },
    background_image: {
        type: sequelize_1.DataTypes.INTEGER
    },
    default_thumb: {
        type: sequelize_1.DataTypes.INTEGER
    },
    author: {
        type: sequelize_1.DataTypes.STRING
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    },
    tags: {
        type: sequelize_1.DataTypes.STRING
    },
    community: {
        type: sequelize_1.DataTypes.INTEGER
    },
    completed: {
        type: sequelize_1.DataTypes.INTEGER
    },
    order: {
        type: sequelize_1.DataTypes.INTEGER
    },
    published: {
        type: sequelize_1.DataTypes.TINYINT
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    tableName: "courses",
    timestamps: false
});
exports.Courses.hasOne(StudentsCourses_1.StudentsCourses, { foreignKey: 'course_id', sourceKey: 'id' });
