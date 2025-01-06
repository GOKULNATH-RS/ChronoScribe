"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mailSchema = new mongoose_1.default.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    target_date: { type: Date, required: true },
    is_recurring: { type: Boolean, required: true },
    recurring_frequency: { type: String, default: '' },
    mail_sent_count: { type: Number, default: 0 },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    date_created: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    completed: { type: Boolean, default: false }
});
var Mail = mongoose_1.default.models.Mail || mongoose_1.default.model('Mail', mailSchema);
exports.default = Mail;
