"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectStudentDto = exports.ApproveStudentDto = exports.ResendOtpDto = exports.VerifyOtpDto = exports.StudentRegisterDto = exports.CertificateType = void 0;
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../../common/validators/decorators");
var CertificateType;
(function (CertificateType) {
    CertificateType["SUDANESE"] = "SUDANESE";
    CertificateType["ARABIAN"] = "ARABIAN";
    CertificateType["FOREIGN"] = "FOREIGN";
})(CertificateType || (exports.CertificateType = CertificateType = {}));
class StudentRegisterDto {
    fullNameAr;
    fullNameEn;
    dateOfBirth;
    phone;
    personalEmail;
    address;
    certificateType;
    nationality;
}
exports.StudentRegisterDto = StudentRegisterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, decorators_1.IsSafeName)('ARABIC'),
    __metadata("design:type", String)
], StudentRegisterDto.prototype, "fullNameAr", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, decorators_1.IsSafeName)('LATIN'),
    __metadata("design:type", String)
], StudentRegisterDto.prototype, "fullNameEn", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StudentRegisterDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StudentRegisterDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, decorators_1.IsUnicodeNormalized)(),
    __metadata("design:type", String)
], StudentRegisterDto.prototype, "personalEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StudentRegisterDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CertificateType),
    __metadata("design:type", String)
], StudentRegisterDto.prototype, "certificateType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, decorators_1.IsUnicodeNormalized)(),
    __metadata("design:type", String)
], StudentRegisterDto.prototype, "nationality", void 0);
class VerifyOtpDto {
    email;
    code;
    type;
}
exports.VerifyOtpDto = VerifyOtpDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, decorators_1.IsUnicodeNormalized)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CertificateType),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "type", void 0);
class ResendOtpDto {
    email;
    type;
}
exports.ResendOtpDto = ResendOtpDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, decorators_1.IsUnicodeNormalized)(),
    __metadata("design:type", String)
], ResendOtpDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CertificateType),
    __metadata("design:type", String)
], ResendOtpDto.prototype, "type", void 0);
class ApproveStudentDto {
    notes;
}
exports.ApproveStudentDto = ApproveStudentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveStudentDto.prototype, "notes", void 0);
class RejectStudentDto {
    reason;
}
exports.RejectStudentDto = RejectStudentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RejectStudentDto.prototype, "reason", void 0);
//# sourceMappingURL=student.dto.js.map