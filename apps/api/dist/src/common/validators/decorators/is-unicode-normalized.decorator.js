"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUnicodeNormalized = IsUnicodeNormalized;
const class_validator_1 = require("class-validator");
function IsUnicodeNormalized(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isUnicodeNormalized',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    const normalized = value.normalize('NFC');
                    return normalized === value;
                },
                defaultMessage(args) {
                    return `${args.property} contains characters that should be normalized (potential homoglyph attack)`;
                },
            },
        });
    };
}
//# sourceMappingURL=is-unicode-normalized.decorator.js.map