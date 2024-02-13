"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptedTermsOfUse = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.AcceptedTermsOfUse = mysql_1.sequelize.define("AcceptedTermsOfUse", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE
    },
}, {
    tableName: "accepted_terms_of_use_instance",
    timestamps: false
});
