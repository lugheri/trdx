"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MetricController_1 = __importDefault(require("../../../controllers/MetricController"));
exports.default = (routes) => {
    //Students
    routes.get('/totalStudents', MetricController_1.default.totalStudents);
    routes.get('/activesNow', MetricController_1.default.activesNow);
    routes.get('/newStudentsLast20days', MetricController_1.default.newStudentsLast20days);
    routes.get('/accessExpireds', MetricController_1.default.accessExpireds);
    routes.get('/satisfactionChart', MetricController_1.default.satisfactionChart);
};
