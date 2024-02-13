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
exports.listCredentials = exports.removeCredential = exports.editCredential = exports.getCredential = exports.newCredential = void 0;
const usersAccess_dto_1 = require("../Dtos/usersAccess.dto");
const systemService_1 = __importDefault(require("../../services/systemService"));
const newCredential = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataCredential = usersAccess_dto_1.CredentialAccessDTO.safeParse(req.body);
    if (!dataCredential.success) {
        res.json({ "error": dataCredential.error });
        return;
    }
    try {
        //Create a new credential
        const dataNewCredential = yield systemService_1.default.createNewCredential(dataCredential.data);
        if (dataNewCredential) {
            res.json({ "success": true, "response": dataNewCredential });
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
exports.newCredential = newCredential;
const getCredential = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credentialId = parseInt(req.params.credentialId);
    try {
        const credential = yield systemService_1.default.getCredential(credentialId);
        console.info(credential);
        res.json({ "success": true, "response": credential });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.getCredential = getCredential;
const editCredential = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credentialId = parseInt(req.params.credentialId);
    const dataCredential = usersAccess_dto_1.CredentialAccessPartialDTO.safeParse(req.body);
    if (!dataCredential.success) {
        res.json({ "error": dataCredential.error });
        return;
    }
    try {
        const edit = yield systemService_1.default.editCredential(credentialId, dataCredential.data);
        res.json({ "success": true, "response": edit });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.editCredential = editCredential;
const removeCredential = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credentialId = parseInt(req.params.credentialId);
    try {
        yield systemService_1.default.removeCredential(credentialId);
        res.json({ "success": true });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.removeCredential = removeCredential;
const listCredentials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statusCredentials = parseInt(req.params.status);
    try {
        const listCredentials = yield systemService_1.default.listCredentials(statusCredentials);
        res.json({ "success": true, "response": listCredentials });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ "error": err });
    }
});
exports.listCredentials = listCredentials;
