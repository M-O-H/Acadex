"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OtpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let OtpService = OtpService_1 = class OtpService {
    logger = new common_1.Logger(OtpService_1.name);
    generateOtp() {
        return (0, crypto_1.randomInt)(1000, 9999).toString();
    }
    async sendSms(phone, code) {
        this.logger.log(`[MOCK SMS] To: ${phone} | Code: ${code}`);
    }
    async sendEmail(to, code) {
        this.logger.log(`[MOCK EMAIL] To: ${to} | Verification code: ${code}`);
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = OtpService_1 = __decorate([
    (0, common_1.Injectable)()
], OtpService);
//# sourceMappingURL=otp.service.js.map