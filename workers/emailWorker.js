"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bullmq_1 = require("bullmq");
var nodemailer = require("nodemailer");
var mailModel_1 = require("../db/models/mailModel");
var dotenv = require("dotenv");
var mongoose_1 = require("mongoose");
// Load environment variables
dotenv.config();
// Configure Redis connection
var redisConnection = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
};
// Configure Nodemailer transporter
var transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});
var connectDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var isDBConnected, MONGO_URI, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isDBConnected)
                    return [2 /*return*/];
                MONGO_URI = process.env.MONGO_URI_PROD;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, mongoose_1.default.connect(MONGO_URI)];
            case 2:
                _a.sent();
                console.log('DB Connected');
                isDBConnected = true;
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log('DB Connection error', error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Function to get the next target date for recurring emails
function getNextTargetDate(targetDate, frequency) {
    var nextDate = new Date(targetDate);
    if (frequency === 'day')
        nextDate.setDate(nextDate.getDate() + 1);
    else if (frequency === 'month')
        nextDate.setMonth(nextDate.getMonth() + 1);
    else if (frequency === 'year')
        nextDate.setFullYear(nextDate.getFullYear() + 1);
    return nextDate;
}
// Worker for processing email jobs
var emailWorker = new bullmq_1.Worker('emailQueue', function (job) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, to, subject, text, is_recurring, target_date, recurring_frequency, mailOptions, response, updatedMail, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = job.data, id = _a.id, to = _a.to, subject = _a.subject, text = _a.text, is_recurring = _a.is_recurring, target_date = _a.target_date, recurring_frequency = _a.recurring_frequency;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, connectDB()
                    // Send email
                ];
            case 2:
                _b.sent();
                mailOptions = {
                    from: 'message@timecapsule.gokulnathrs.me',
                    to: to,
                    subject: subject,
                    text: text
                };
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 3:
                response = _b.sent();
                console.log("Email sent to ".concat(to, ": ").concat(response.response));
                return [4 /*yield*/, mailModel_1.default.findByIdAndUpdate(id, __assign({ $inc: { mail_sent_count: 1 } }, (is_recurring && {
                        target_date: getNextTargetDate(target_date, recurring_frequency)
                    }) // Update target_date if recurring
                    ), { new: true } // Return the updated document
                    )];
            case 4:
                updatedMail = _b.sent();
                console.log('Mail updated:', updatedMail);
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.error("Failed to send email to ".concat(to, ":"), error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); }, { connection: redisConnection });
// Start worker and handle connection
connectDB().catch(function (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});
emailWorker.on('completed', function (job) {
    console.log("Job ".concat(job.id, " completed successfully"));
});
emailWorker.on('failed', function (job, err) {
    console.error("Job ".concat(job === null || job === void 0 ? void 0 : job.id, " failed with error:"), err);
});
exports.default = emailWorker;
