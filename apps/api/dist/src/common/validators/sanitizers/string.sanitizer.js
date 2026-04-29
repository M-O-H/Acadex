"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringSanitizer = void 0;
class StringSanitizer {
    static normalizeUnicode(input) {
        return input.normalize('NFC');
    }
    static toASCII(input) {
        return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    static trimAndNormalize(input) {
        return input.trim().normalize('NFC');
    }
    static removeControlCharacters(input) {
        return input
            .replace(/[\x00-\x1F\x7F]/g, '')
            .replace(/[\u200B-\u200D\uFEFF]/g, '');
    }
    static removeInvisibleCharacters(input) {
        return input
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .replace(/[\u200E\u200F\u202A-\u202E]/g, '');
    }
    static sanitizeFilename(input) {
        return input
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    }
    static stripHTML(input) {
        return input.replace(/<[^>]*>/g, '').trim();
    }
}
exports.StringSanitizer = StringSanitizer;
//# sourceMappingURL=string.sanitizer.js.map