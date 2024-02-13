"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routesApi_1 = __importDefault(require("./routesApi"));
const routesAuth_1 = __importDefault(require("./routesAuth"));
// ::: A D M I N   A R E A  :::
// :: Dashboard
// :: Content
const routesHomeConfig_1 = __importDefault(require("./admin/content/routesHomeConfig"));
const routesCatalog_1 = __importDefault(require("./admin/content/routesCatalog"));
const routesComments_1 = __importDefault(require("./admin/content/routesComments"));
const routesTeachers_1 = __importDefault(require("./admin/content/routesTeachers"));
// :: Community
// :: Students
const routesStudents_1 = __importDefault(require("./admin/students/routesStudents"));
// :: Support
// :: Platform
const routesGallery_1 = __importDefault(require("./admin/platform/routesGallery"));
const routesMail_1 = __importDefault(require("./admin/platform/routesMail"));
const routesIntegrations_1 = __importDefault(require("./admin/platform/routesIntegrations"));
// :: Metrics
const routesMetrics_1 = __importDefault(require("./admin/metrics/routesMetrics"));
// :: Setup
//PLATFORM
const routesClassRoom_1 = __importDefault(require("./platform/routesClassRoom"));
const routesSystem_1 = __importDefault(require("./admin/routesSystem"));
const routesUsers_1 = __importDefault(require("./admin/routesUsers"));
const routesProfileStudent_1 = __importDefault(require("./platform/routesProfileStudent"));
const routesSecurity_1 = __importDefault(require("./admin/routesSecurity"));
const routes = (0, express_1.Router)();
(0, routesApi_1.default)(routes);
(0, routesAuth_1.default)(routes);
// ::::::::::::::::::::::::::::::::::::::::::  A D M I N   A R E A  ::::::::::::::::::::::::::::::::::::::::::
// :: Dashboard
// :: Content
(0, routesHomeConfig_1.default)(routes);
(0, routesCatalog_1.default)(routes);
(0, routesComments_1.default)(routes);
(0, routesTeachers_1.default)(routes);
// :: Community
// :: Students
(0, routesStudents_1.default)(routes);
// :: Support
// :: Platform
(0, routesGallery_1.default)(routes);
(0, routesMail_1.default)(routes);
(0, routesIntegrations_1.default)(routes);
// :: Metrics
(0, routesMetrics_1.default)(routes);
// :: Setup
// ::::::::::::::::::::::::::::::::::::::::  S T U D E N T   A R E A  ::::::::::::::::::::::::::::::::::::::::
//PLATFORM
(0, routesClassRoom_1.default)(routes);
//Community
//Students
(0, routesProfileStudent_1.default)(routes);
//Support
//Platform
//Reports
//Configs
(0, routesSystem_1.default)(routes);
(0, routesSecurity_1.default)(routes);
(0, routesUsers_1.default)(routes);
exports.default = routes;
