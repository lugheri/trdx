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
Object.defineProperty(exports, "__esModule", { value: true });
const Levels_1 = require("../models/Levels");
const Credentials_1 = require("../models/Credentials");
const Modules_1 = require("../models/Modules");
class systemService {
    //LEVELS
    createNewLevel(levelData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newLevel, created] = yield Levels_1.Levels.findOrCreate({
                where: { name: levelData.name },
                defaults: levelData
            });
            console.info('created', created);
            return newLevel.id ? newLevel : false;
        });
    }
    editLevel(levelId, levelData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Levels_1.Levels.update(levelData, { where: { id: levelId } });
            return true;
        });
    }
    removeLevel(levelId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Levels_1.Levels.destroy({ where: { id: levelId } });
            return true;
        });
    }
    getLevel(levelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const level = yield Levels_1.Levels.findByPk(levelId);
            return level ? level : false;
        });
    }
    listLevels(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const listLevels = yield Levels_1.Levels.findAll({ where: { status: status } });
            return listLevels;
        });
    }
    //CREDENTIALS
    createNewCredential(credentialData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newCredential, created] = yield Credentials_1.Credentials.findOrCreate({
                where: { name: credentialData.name },
                defaults: credentialData
            });
            console.info('created', created);
            return newCredential.id ? newCredential : false;
        });
    }
    editCredential(credentialId, credentialData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Credentials_1.Credentials.update(credentialData, { where: { id: credentialId } });
            return true;
        });
    }
    removeCredential(credentialId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Credentials_1.Credentials.destroy({ where: { id: credentialId } });
            return true;
        });
    }
    getCredential(credentialId) {
        return __awaiter(this, void 0, void 0, function* () {
            const credential = yield Credentials_1.Credentials.findByPk(credentialId);
            return credential ? credential : false;
        });
    }
    listCredentials(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const listCredentials = yield Credentials_1.Credentials.findAll({ where: { status: status } });
            return listCredentials;
        });
    }
    //MODULES
    createNewModule(moduleData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newModule, created] = yield Modules_1.Modules.findOrCreate({
                where: { name: moduleData.name },
                defaults: moduleData
            });
            console.info('created', created);
            return newModule.id ? newModule : false;
        });
    }
    editModule(moduleId, moduleData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Modules_1.Modules.update(moduleData, { where: { id: moduleId } });
            return true;
        });
    }
    removeModule(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Modules_1.Modules.destroy({ where: { id: moduleId } });
            return true;
        });
    }
    getModule(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const module = yield Modules_1.Modules.findByPk(moduleId);
            return module ? module : false;
        });
    }
    listModules(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const listModules = yield Modules_1.Modules.findAll({ where: { status: status } });
            return listModules;
        });
    }
}
exports.default = new systemService();
