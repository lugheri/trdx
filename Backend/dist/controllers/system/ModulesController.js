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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listModules = exports.removeModule = exports.editModule = exports.getModule = exports.newModule = void 0;
const usersAccess_dto_1 = require("../Dtos/usersAccess.dto");
const systemService_1 = __importDefault(require("../../services/systemService"));
const newModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataModule = usersAccess_dto_1.ModuleAccessDTO.safeParse(req.body);
    if (!dataModule.success) {
        res.json({ "error": dataModule.error });
        return;
    }
    try {
        //Create a new module
        const dataNewModule = yield systemService_1.default.createNewModule(dataModule.data);
        if (dataNewModule) {
            res.json({ "success": true, "response": dataNewModule });
            return;
        }
        res.json({ "error": "Falha ao criar o novo Nível de acesso!" });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.newModule = newModule;
const getModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleId = parseInt(req.params.moduleId);
    try {
        const module = yield systemService_1.default.getModule(moduleId);
        res.json({ "success": true, "response": module });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.getModule = getModule;
const editModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleId = parseInt(req.params.moduleId);
    const dataModule = usersAccess_dto_1.ModuleAccessPartialDTO.safeParse(req.body);
    if (!dataModule.success) {
        res.json({ "error": dataModule.error });
        return;
    }
    try {
        const edit = yield systemService_1.default.editModule(moduleId, dataModule.data);
        res.json({ "success": true, "response": edit });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.editModule = editModule;
const removeModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleId = parseInt(req.params.moduleId);
    try {
        yield systemService_1.default.removeModule(moduleId);
        res.json({ "success": true });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.removeModule = removeModule;
const listModules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statusModules = parseInt(req.params.status);
    try {
        const listModules = yield systemService_1.default.listModules(statusModules);
        res.json({ "success": true, "response": listModules });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.listModules = listModules;
