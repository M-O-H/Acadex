"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsASCIIOnly = IsASCIIOnly;
const class_validator_1 = require("class-validator");
function IsASCIIOnly(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isASCIIOnly',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    const asciiRegex = /^[\x00-\x7F]*$/;
                    return asciiRegex.test(value);
                },
                defaultMessage(args) {
                    return `${args.property} must contain only ASCII characters (0x00-0x7F)`;
                },
            },
        });
    };
}
//# sourceMappingURL=is-ascii-only.decorator.js.map