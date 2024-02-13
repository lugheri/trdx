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
const integrationPlatformService_1 = __importDefault(require("../services/integrationPlatformService"));
const integration_dto_1 = require("./Dtos/integration.dto");
const IntegrationProductService_1 = __importDefault(require("../services/IntegrationProductService"));
const IntegrationOffersService_1 = __importDefault(require("../services/IntegrationOffersService"));
const IntegrationCoursesService_1 = __importDefault(require("../services/IntegrationCoursesService"));
const integrationHooksHistoryService_1 = __importDefault(require("../services/integrationHooksHistoryService"));
const emailCopyService_1 = __importDefault(require("../services/emailCopyService"));
const mailAccountService_1 = __importDefault(require("../services/mailAccountService"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class IntegrationsController {
    //Platforms
    newPlatformIntegration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataPlatform = integration_dto_1.IntegrationPlatformDTO.safeParse(req.body);
            if (!dataPlatform.success) {
                res.json({ "error": dataPlatform.error });
                return;
            }
            try {
                //Create a new credential
                const dataNewPlatform = yield integrationPlatformService_1.default.newIntegration(dataPlatform.data);
                if (dataNewPlatform) {
                    res.json({ "success": true, "response": dataNewPlatform });
                    return;
                }
                res.json({ "error": "Falha ao cadastrar plataforma de integração!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    listPlatformIntegration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = parseInt(req.params.status);
            try {
                const listIntegrations = yield integrationPlatformService_1.default.getIntegrations(status);
                if (listIntegrations) {
                    res.json({ "success": true, "response": listIntegrations });
                    return;
                }
                res.json({ "error": "Falha ao recuperar plataformas!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar plataformas!" });
            }
        });
    }
    infoPlatformIntegration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const integration_id = parseInt(req.params.integration_id);
            try {
                const infoPlatform = yield integrationPlatformService_1.default.infoIntegrations(integration_id);
                if (infoPlatform) {
                    res.json({ "success": true, "response": infoPlatform });
                    return;
                }
                res.json({ "error": "Falha ao recuperar plataforma!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar plataforma!" });
            }
        });
    }
    editPlatformIntegration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const integration_id = parseInt(req.params.integration_id);
            const dataPlatform = integration_dto_1.IntegrationPlatformDTO.safeParse(req.body);
            if (!dataPlatform.success) {
                res.json({ "error": dataPlatform.error });
                return;
            }
            try {
                const edit = yield integrationPlatformService_1.default.editIntegration(integration_id, dataPlatform.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Products
    newProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataProduct = integration_dto_1.IntegrationProductDTO.safeParse(req.body);
            if (!dataProduct.success) {
                res.json({ "error": dataProduct.error });
                return;
            }
            try {
                //Create a new credential
                const dataNewProduct = yield IntegrationProductService_1.default.newProduct(dataProduct.data);
                if (dataNewProduct) {
                    res.json({ "success": true, "response": dataNewProduct });
                    return;
                }
                res.json({ "error": "Falha ao cadastrar produto!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    listProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = parseInt(req.params.status);
            const integration = req.params.integration;
            try {
                const listProducts = yield IntegrationProductService_1.default.getProductsPlatform(status, integration);
                if (listProducts) {
                    res.json({ "success": true, "response": listProducts });
                    return;
                }
                res.json({ "error": "Falha ao recuperar produtos!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar produtos!" });
            }
        });
    }
    infoProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_id = parseInt(req.params.product_id);
            try {
                const infoProduct = yield IntegrationProductService_1.default.infoProduct(product_id);
                if (infoProduct) {
                    res.json({ "success": true, "response": infoProduct });
                    return;
                }
                res.json({ "error": "Falha ao recuperar produto!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar produto!" });
            }
        });
    }
    editProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_id = parseInt(req.params.product_id);
            const dataProduct = integration_dto_1.IntegrationProductDTO.safeParse(req.body);
            if (!dataProduct.success) {
                res.json({ "error": dataProduct.error });
                return;
            }
            try {
                const edit = yield IntegrationProductService_1.default.editProduct(product_id, dataProduct.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_id = parseInt(req.params.product_id);
            try {
                yield IntegrationProductService_1.default.removeProduct(product_id);
                res.json({ "success": true, "response": true });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao remover produto!" });
            }
        });
    }
    //Offers
    newOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataOffer = integration_dto_1.IntegrationOfferDTO.safeParse(req.body);
            if (!dataOffer.success) {
                res.json({ "error": dataOffer.error });
                return;
            }
            try {
                //Create a new credential
                const dataNewOffer = yield IntegrationOffersService_1.default.newOffer(dataOffer.data);
                if (dataNewOffer) {
                    res.json({ "success": true, "response": dataNewOffer });
                    return;
                }
                res.json({ "error": "Falha ao cadastrar oferta!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    listOffers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_id = parseInt(req.params.product_id);
            const status = parseInt(req.params.status);
            try {
                const listOffers = yield IntegrationOffersService_1.default.getOffers(status, product_id);
                if (listOffers) {
                    res.json({ "success": true, "response": listOffers });
                    return;
                }
                res.json({ "error": "Falha ao recuperar Ofertas!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar Ofertas!" });
            }
        });
    }
    infoOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const offer_id = parseInt(req.params.offer_id);
            try {
                const infoOffer = yield IntegrationOffersService_1.default.infoOffer(offer_id);
                if (infoOffer) {
                    res.json({ "success": true, "response": infoOffer });
                    return;
                }
                res.json({ "error": "Falha ao recuperar oferta!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar oferta!" });
            }
        });
    }
    editOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const offer_id = parseInt(req.params.offer_id);
            const dataOffer = integration_dto_1.IntegrationOfferDTO.safeParse(req.body);
            if (!dataOffer.success) {
                res.json({ "error": dataOffer.error });
                return;
            }
            try {
                const edit = yield IntegrationOffersService_1.default.editOffer(offer_id, dataOffer.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    deleteOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const offer_id = parseInt(req.params.offer_id);
            try {
                yield IntegrationOffersService_1.default.removeOffer(offer_id);
                res.json({ "success": true, "response": true });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao remover oferta!" });
            }
        });
    }
    //Courses
    newCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataCourse = integration_dto_1.IntegrationCoursesDTO.safeParse(req.body);
            if (!dataCourse.success) {
                res.json({ "error": dataCourse.error });
                return;
            }
            try {
                //Create a new credential
                const dataNewCourse = yield IntegrationCoursesService_1.default.newCourse(dataCourse.data);
                if (dataNewCourse) {
                    res.json({ "success": true, "response": dataNewCourse });
                    return;
                }
                res.json({ "error": "Falha ao cadastrar curso!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    listCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_id = parseInt(req.params.product_id);
            const offer_id = parseInt(req.params.offer_id);
            try {
                const listCourse = yield IntegrationCoursesService_1.default.getCoursesPlatform(product_id, offer_id);
                if (listCourse) {
                    res.json({ "success": true, "response": listCourse });
                    return;
                }
                res.json({ "error": "Falha ao recuperar cursos!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar cursos!" });
            }
        });
    }
    infoCourseStudentPlatform(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const offer_id = parseInt(req.params.offer_id);
            const course_id_students = parseInt(req.params.course_id_students);
            try {
                const infoCourse = yield IntegrationCoursesService_1.default.infoCourseStudentPlatform(offer_id, course_id_students);
                if (infoCourse) {
                    res.json({ "success": true, "response": infoCourse });
                    return;
                }
                res.json({ "error": "Falha ao recuperar curso!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar curso!" });
            }
        });
    }
    editCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const course_id = parseInt(req.params.course_id);
            const dataCourse = integration_dto_1.IntegrationCoursesDTO.safeParse(req.body);
            if (!dataCourse.success) {
                res.json({ "error": dataCourse.error });
                return;
            }
            try {
                const edit = yield IntegrationCoursesService_1.default.editCourse(course_id, dataCourse.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    deleteCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const course_id = parseInt(req.params.course_id);
            try {
                yield IntegrationCoursesService_1.default.removeCourse(course_id);
                res.json({ "success": true, "response": true });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao remover produto!" });
            }
        });
    }
    //Hooks
    listHooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const integration = req.params.integration;
            const product_id = parseInt(req.params.product_id);
            const page = parseInt(req.params.page);
            try {
                const listHooks = yield integrationHooksHistoryService_1.default.listIntegrationHooks(page, integration, product_id);
                if (listHooks) {
                    res.json({ "success": true, "response": listHooks });
                    return;
                }
                res.json({ "error": "Falha ao recuperar hooks!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar hooks!" });
            }
        });
    }
    infoHooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hook_id = parseInt(req.params.hook_id);
            try {
                const infoHook = yield integrationHooksHistoryService_1.default.getHook(hook_id);
                if (infoHook) {
                    res.json({ "success": true, "response": infoHook });
                    return;
                }
                res.json({ "error": "Falha ao recuperar hook!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar hook!" });
            }
        });
    }
    //Emails Copys
    newCopy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataCopy = integration_dto_1.EmailCopyDTO.safeParse(req.body);
            if (!dataCopy.success) {
                res.json({ "error": dataCopy.error });
                return;
            }
            try {
                //Create a new credential
                const dataNewCopy = yield emailCopyService_1.default.newCopy(dataCopy.data);
                if (dataNewCopy) {
                    res.json({ "success": true, "response": dataNewCopy });
                    return;
                }
                res.json({ "error": "Falha ao cadastrar copy!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    listCopys(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listCopys = yield emailCopyService_1.default.getCopys();
                if (listCopys) {
                    res.json({ "success": true, "response": listCopys });
                    return;
                }
                res.json({ "error": "Falha ao recuperar copys!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar copys!" });
            }
        });
    }
    infoCopy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const copy_id = parseInt(req.params.copy_id);
            try {
                const infoCopy = yield emailCopyService_1.default.infoCopy(copy_id);
                if (infoCopy) {
                    res.json({ "success": true, "response": infoCopy });
                    return;
                }
                res.json({ "error": "Falha ao recuperar copy!" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao recuperar copy!" });
            }
        });
    }
    editCopy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const copy_id = parseInt(req.params.copy_id);
            const dataCopy = integration_dto_1.EmailCopyDTO.safeParse(req.body);
            if (!dataCopy.success) {
                res.json({ "error": dataCopy.error });
                return;
            }
            try {
                const edit = yield emailCopyService_1.default.editCopy(copy_id, dataCopy.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    deleteCopy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const copy_id = parseInt(req.params.copy_id);
            try {
                yield emailCopyService_1.default.removeCourse(copy_id);
                res.json({ "success": true, "response": true });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": "Falha ao remover copy!" });
            }
        });
    }
    //Send Test Copy
    sendTestCopy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataSend = req.body;
            const listAccounts = yield mailAccountService_1.default.listAccounts();
            const dataAccount = listAccounts[0];
            if (!dataAccount) {
                res.json({ "error": "Conta de E-mail não localizada" });
                return;
            }
            // Configurações do transporte (SMTP)
            const transporter = nodemailer_1.default.createTransport({
                host: dataAccount.host,
                port: dataAccount.port,
                secure: dataAccount.secure == 1 ? true : false,
                auth: {
                    user: dataAccount.user,
                    pass: dataAccount.pass, // Senha do servidor SMTP
                },
            });
            // Opções do e-mail
            const mailOptions = {
                from: `${dataSend.from} <${dataAccount.user}>`,
                to: dataSend.mailTo,
                cc: "",
                bcc: "",
                subject: dataSend.subject,
                html: dataSend.body,
            };
            // Envia o e-mail
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erro ao enviar e-mail:', error);
                    res.json({ "success": false, "message": `Erro ao enviar e-mail: ${error}` });
                }
                else {
                    console.info('E-mail enviado com sucesso! ID:', info.messageId);
                    res.json({ "success": true, "message": `E-mail enviado com sucesso! ID:${info.messageId}` });
                }
            });
        });
    }
}
exports.default = new IntegrationsController();
