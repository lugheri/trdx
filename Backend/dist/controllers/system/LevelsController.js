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
exports.listLevels = exports.removeLevel = exports.editLevel = exports.getLevel = exports.newLevel = void 0;
const usersAccess_dto_1 = require("../Dtos/usersAccess.dto");
const systemService_1 = __importDefault(require("../../services/systemService"));
const newLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataLevel = usersAccess_dto_1.LevelAccessDTO.safeParse(req.body);
    if (!dataLevel.success) {
        res.json({ "error": dataLevel.error });
        return;
    }
    try {
        //Create a new level
        const dataNewlevel = yield systemService_1.default.createNewLevel(dataLevel.data);
        if (dataNewlevel) {
            res.json({ "success": true, "response": dataNewlevel });
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
exports.newLevel = newLevel;
const getLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const levelId = parseInt(req.params.levelId);
    try {
        const level = yield systemService_1.default.getLevel(levelId);
        console.error(level);
        res.json({ "success": true, "response": level });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.getLevel = getLevel;
const editLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const levelId = parseInt(req.params.levelId);
    const dataLevel = usersAccess_dto_1.LevelAccessPartialDTO.safeParse(req.body);
    if (!dataLevel.success) {
        res.json({ "error": dataLevel.error });
        return;
    }
    try {
        const edit = yield systemService_1.default.editLevel(levelId, dataLevel.data);
        res.json({ "success": true, "response": edit });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.editLevel = editLevel;
const removeLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const levelId = parseInt(req.params.levelId);
    try {
        yield systemService_1.default.removeLevel(levelId);
        res.json({ "success": true });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.removeLevel = removeLevel;
const listLevels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statusLevels = parseInt(req.params.status);
    try {
        const listLevels = yield systemService_1.default.listLevels(statusLevels);
        res.json({ "success": true, "response": listLevels });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.listLevels = listLevels;
