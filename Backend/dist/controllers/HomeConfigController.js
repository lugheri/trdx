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
const homeConfig_dto_1 = require("./Dtos/homeConfig.dto");
const homeConfigCommunityService_1 = __importDefault(require("../services/homeConfigCommunityService"));
const homeButtonsCommunityServices_1 = __importDefault(require("../services/homeButtonsCommunityServices"));
const homeButtonsService_1 = __importDefault(require("../services/homeButtonsService"));
const homeConfigService_1 = __importDefault(require("../services/homeConfigService"));
const socialMediaService_1 = __importDefault(require("../services/socialMediaService"));
class HomeConfigController {
    //Video Community
    updateVideoWelcomeCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataVideoWelcome = homeConfig_dto_1.WelcomeVideoDTO.safeParse(req.body);
            if (!dataVideoWelcome.success) {
                res.json({ "error": dataVideoWelcome.error });
                return;
            }
            try {
                const video = yield homeConfigCommunityService_1.default.getWelcomeVideo();
                let newVideoWelcome;
                if (video) {
                    newVideoWelcome = yield homeConfigCommunityService_1.default.updateWelcomeVideo(dataVideoWelcome.data);
                }
                else {
                    newVideoWelcome = yield homeConfigCommunityService_1.default.createNewWelcomeVideo(dataVideoWelcome.data);
                }
                if (newVideoWelcome) {
                    res.json({ "success": true, "response": newVideoWelcome });
                    return;
                }
                res.json({ "error": "Falha ao cadastrar novo video!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    getVideoWelcomeCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const video = yield homeConfigCommunityService_1.default.getWelcomeVideo();
                res.json({ "success": true, "response": video });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Text Community
    updateTextHomeCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataTextHomeCommunity = homeConfig_dto_1.TextHomeDTO.safeParse(req.body);
            if (!dataTextHomeCommunity.success) {
                res.json({ "error": dataTextHomeCommunity.error });
                return;
            }
            try {
                const newTextHomeCommunity = yield homeConfigCommunityService_1.default.updateTextHome(dataTextHomeCommunity.data);
                if (newTextHomeCommunity) {
                    res.json({ "success": true, "response": newTextHomeCommunity });
                    return;
                }
                res.json({ "error": "Falha ao cadastrar novo video!" });
                const text = yield homeConfigCommunityService_1.default.getTextHome();
                let newTextWelcome;
                if (text) {
                    newTextWelcome = yield homeConfigCommunityService_1.default.updateTextHome(dataTextHomeCommunity.data);
                }
                else {
                    newTextWelcome = yield homeConfigCommunityService_1.default.createNewWelcomeText(dataTextHomeCommunity.data);
                }
                if (newTextWelcome) {
                    res.json({ "success": true, "response": newTextWelcome });
                    return;
                }
                res.json({ "error": "Falha ao cadastrar novo texto!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    getTextHomeCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const textHome = yield homeConfigCommunityService_1.default.getTextHome();
                res.json({ "success": true, "response": textHome });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Buttons Community
    newButtonCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataButton = homeConfig_dto_1.ButtonHomeDTO.safeParse(req.body);
            if (!dataButton.success) {
                res.json({ "error": dataButton.error });
                return;
            }
            try {
                const newButton = yield homeButtonsCommunityServices_1.default.newButtonHome(dataButton.data);
                res.json({ "success": true, "response": newButton });
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    getButtonsCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buttons = yield homeButtonsCommunityServices_1.default.getButtonsHome();
                res.json({ "success": true, "response": buttons });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    infoButtonCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const button_id = parseInt(req.params.button_id);
            try {
                const infoButton = yield homeButtonsCommunityServices_1.default.infoButtonHome(button_id);
                res.json({ "success": true, "response": infoButton });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    updateButtonCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const button_id = parseInt(req.params.button_id);
            const dataButton = homeConfig_dto_1.ButtonHomeDTO.safeParse(req.body);
            if (!dataButton.success) {
                res.json({ "error": dataButton.error });
                return;
            }
            try {
                const updateButton = yield homeButtonsCommunityServices_1.default.updateButtonHome(button_id, dataButton.data);
                res.json({ "success": true, "response": updateButton });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    deleteButtonCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const button_id = parseInt(req.params.button_id);
            try {
                yield homeButtonsCommunityServices_1.default.deleteButtonHome(button_id);
                res.json({ "success": true });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    //Video Default
    updateVideoWelcome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataVideoWelcome = homeConfig_dto_1.WelcomeVideoDTO.safeParse(req.body);
            if (!dataVideoWelcome.success) {
                res.json({ "error": dataVideoWelcome.error });
                return;
            }
            try {
                const video = yield homeConfigService_1.default.getWelcomeVideo();
                let newVideoWelcome;
                if (video) {
                    newVideoWelcome = yield homeConfigService_1.default.updateWelcomeVideo(dataVideoWelcome.data);
                }
                else {
                    newVideoWelcome = yield homeConfigService_1.default.createNewWelcomeVideo(dataVideoWelcome.data);
                }
                if (newVideoWelcome) {
                    res.json({ "success": true, "response": newVideoWelcome });
                    return;
                }
                res.json({ "error": "Falha ao cadastrar novo video!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    getVideoWelcome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const video = yield homeConfigService_1.default.getWelcomeVideo();
                res.json({ "success": true, "response": video });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Text Default
    updateTextHome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataTextHome = homeConfig_dto_1.TextHomeDTO.safeParse(req.body);
            if (!dataTextHome.success) {
                res.json({ "error": dataTextHome.error });
                return;
            }
            try {
                const newTextHome = yield homeConfigService_1.default.updateTextHome(dataTextHome.data);
                if (newTextHome) {
                    res.json({ "success": true, "response": newTextHome });
                    return;
                }
                res.json({ "error": "Falha ao cadastrar novo video!" });
                const text = yield homeConfigService_1.default.getTextHome();
                let newTextWelcome;
                if (text) {
                    newTextWelcome = yield homeConfigService_1.default.updateTextHome(dataTextHome.data);
                }
                else {
                    newTextWelcome = yield homeConfigService_1.default.createNewWelcomeText(dataTextHome.data);
                }
                if (newTextWelcome) {
                    res.json({ "success": true, "response": newTextWelcome });
                    return;
                }
                res.json({ "error": "Falha ao cadastrar novo texto!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    getTextHome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const textHome = yield homeConfigService_1.default.getTextHome();
                res.json({ "success": true, "response": textHome });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Buttons Default
    newButton(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataButton = homeConfig_dto_1.ButtonHomeDTO.safeParse(req.body);
            if (!dataButton.success) {
                res.json({ "error": dataButton.error });
                return;
            }
            try {
                const newButton = yield homeButtonsService_1.default.newButtonHome(dataButton.data);
                res.json({ "success": true, "response": newButton });
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    getButtons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buttons = yield homeButtonsService_1.default.getButtonsHome();
                res.json({ "success": true, "response": buttons });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    infoButton(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const button_id = parseInt(req.params.button_id);
            try {
                const infoButton = yield homeButtonsService_1.default.infoButtonHome(button_id);
                res.json({ "success": true, "response": infoButton });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    updateButton(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const button_id = parseInt(req.params.button_id);
            const dataButton = homeConfig_dto_1.ButtonHomeDTO.safeParse(req.body);
            if (!dataButton.success) {
                res.json({ "error": dataButton.error });
                return;
            }
            try {
                const updateButton = yield homeButtonsService_1.default.updateButtonHome(button_id, dataButton.data);
                res.json({ "success": true, "response": updateButton });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    deleteButton(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const button_id = parseInt(req.params.button_id);
            try {
                yield homeButtonsService_1.default.deleteButtonHome(button_id);
                res.json({ "success": true });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    //Social Media
    newSocialMedia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataSocialMedia = homeConfig_dto_1.SocialMediaDTO.safeParse(req.body);
            if (!dataSocialMedia.success) {
                res.json({ "error": dataSocialMedia.error });
                return;
            }
            try {
                const newSocialMedia = yield socialMediaService_1.default.newSocialMedia(dataSocialMedia.data);
                res.json({ "success": true, "response": newSocialMedia });
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    getSocialMedias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const socialMedias = yield socialMediaService_1.default.getSocialMedias();
                res.json({ "success": true, "response": socialMedias });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    infoSocialMedia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const media_id = parseInt(req.params.media_id);
            try {
                const infoSocialMedia = yield socialMediaService_1.default.infoSocialMedia(media_id);
                res.json({ "success": true, "response": infoSocialMedia });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    updateSocialMedia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const media_id = parseInt(req.params.media_id);
            const infoSocialMedia = homeConfig_dto_1.SocialMediaDTO.safeParse(req.body);
            if (!infoSocialMedia.success) {
                res.json({ "error": infoSocialMedia.error });
                return;
            }
            try {
                const updateButton = yield socialMediaService_1.default.updateSocialMedia(media_id, infoSocialMedia.data);
                res.json({ "success": true, "response": updateButton });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    deleteSocialMedia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const media_id = parseInt(req.params.media_id);
            try {
                yield socialMediaService_1.default.deleteSocialMedia(media_id);
                res.json({ "success": true });
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
}
exports.default = new HomeConfigController();
