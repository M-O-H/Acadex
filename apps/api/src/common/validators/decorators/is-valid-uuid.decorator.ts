import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function IsValidUUID(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidUUID',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return false;
          return UUID_REGEX.test(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a valid UUID v1-5`;
        },
      },
    });
  };
}
