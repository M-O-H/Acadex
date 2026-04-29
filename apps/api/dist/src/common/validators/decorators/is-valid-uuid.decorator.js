"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidUUID = IsValidUUID;
const class_validator_1 = require("class-validator");
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function IsValidUUID(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidUUID',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    return UUID_REGEX.test(value);
                },
                defaultMessage(args) {
                    return `${args.property} must be a valid UUID v1-5`;
                },
            },
        });
    };
}
//# sourceMappingURL=is-valid-uuid.decorator.js.map