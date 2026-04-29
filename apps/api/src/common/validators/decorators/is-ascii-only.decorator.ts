/* eslint-disable no-control-regex */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsASCIIOnly(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isASCIIOnly',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return false;
          const asciiRegex = /^[\x00-\x7F]*$/;
          return asciiRegex.test(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must contain only ASCII characters (0x00-0x7F)`;
        },
      },
    });
  };
}
