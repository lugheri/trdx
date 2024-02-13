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
const metricsServices_1 = __importDefault(require("../services/metricsServices"));
const coursesValidityContractsService_1 = __importDefault(require("../services/coursesValidityContractsService"));
const studentContractValidityService_1 = __importDefault(require("../services/studentContractValidityService"));
const studentContractsValidity_dto_1 = require("./Dtos/studentContractsValidity.dto");
const moment_1 = __importDefault(require("moment"));
const redis_1 = require("../config/redis");
class MetricController {
    totalStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield metricsServices_1.default.countStudents(0, null);
            const community = yield metricsServices_1.default.countStudents(1, null);
            res.json({ 'students': students, 'community': community });
        });
    }
    activesNow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessions = yield (0, redis_1.redisGet)('activeSessions');
            res.json(sessions == null ? 0 : sessions.length);
        });
    }
    newStudentsLast20days(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = (0, moment_1.default)();
            const today = date.format('YYYY-MM-DD');
            const init = (0, moment_1.default)(today, 'YYYY-MM-DD');
            let initDate = init.subtract(20, 'days').format('YYYY-MM-DD');
            const dates = [];
            const students = [];
            const community = [];
            for (let i = 0; i <= 20; ++i) {
                dates.push((0, moment_1.default)(initDate).format('DD/MM'));
                students.push(yield metricsServices_1.default.countStudents(0, initDate));
                community.push(yield metricsServices_1.default.countStudents(1, initDate));
                const day = (0, moment_1.default)(initDate, 'YYYY-MM-DD');
                initDate = day.add(1, 'days').format('YYYY-MM-DD');
            }
            res.json({ dates, students, community });
        });
    }
    accessExpireds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Checking Status 
            try {
                const studentsWithoutStatus = yield metricsServices_1.default.checkExpiredAccess();
                for (const student of studentsWithoutStatus) {
                    const studentId = student.id;
                    //Get Contract Student
                    const contract = yield coursesValidityContractsService_1.default.endDataContractStudent(studentId);
                    //Add Student Contract
                    if (contract !== null) {
                        const dataContract = studentContractsValidity_dto_1.StudentContractValidityDTO.safeParse({
                            student_id: studentId,
                            payment_cycle: contract.payment_cycle,
                            expired_in: contract.end_validity,
                            status: 1
                        });
                        if (dataContract.success) {
                            yield studentContractValidityService_1.default.createNewStudentContract(dataContract.data);
                        }
                    }
                }
                //Get Students by Status
                const actives = yield metricsServices_1.default.studentStatus('actives');
                const inactive = yield metricsServices_1.default.studentStatus('inactive');
                const expired = yield metricsServices_1.default.studentStatus('expired');
                const endContract = yield metricsServices_1.default.studentStatus('endContract');
                res.json({ actives: actives, inactive: inactive, expired: expired, endContract: endContract });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    satisfactionChart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const satisfaction = yield metricsServices_1.default.satisfactionCourses();
                const courses = [];
                const average = [];
                for (const s of satisfaction) {
                    courses.push(s.name);
                    const media = parseFloat(s.media === null ? 0 : s.media).toFixed(1);
                    average.push(parseFloat(media));
                }
                res.json({ "success": true, "response": [{ "courses": courses }, { "average": average }] });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
}
exports.default = new MetricController();
