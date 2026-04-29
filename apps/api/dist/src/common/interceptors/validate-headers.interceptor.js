"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateHeadersInterceptor = void 0;
const common_1 = require("@nestjs/common");
const ASCII_ONLY_HEADERS = [
    'accept',
    'accept-language',
    'content-language',
    'content-type',
];
let ValidateHeadersInterceptor = class ValidateHeadersInterceptor {
    intercept(context, next) {
        const request = context
            .switchToHttp()
            .getRequest();
        const headers = request.headers;
        for (const [key, value] of Object.entries(headers)) {
            if (ASCII_ONLY_HEADERS.includes(key.toLowerCase())) {
                if (typeof value === 'string' && !/^[\x00-\x7F]*$/.test(value)) {
                    throw new common_1.BadRequestException(`Header ${key} must contain only ASCII characters`);
                }
            }
        }
        const contentType = headers['content-type'];
        if (contentType && !/^[\x00-\x7F]*$/.test(contentType)) {
            throw new common_1.BadRequestException('Content-Type header must contain only ASCII characters');
        }
        return next.handle();
    }
};
exports.ValidateHeadersInterceptor = ValidateHeadersInterceptor;
exports.ValidateHeadersInterceptor = ValidateHeadersInterceptor = __decorate([
    (0, common_1.Injectable)()
], ValidateHeadersInterceptor);
//# sourceMappingURL=validate-headers.interceptor.js.map