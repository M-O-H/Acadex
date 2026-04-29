import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsUnicodeNormalized(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUnicodeNormalized',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return false;
          const normalized = value.normalize('NFC');
          return normalized === value;
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} contains characters that should be normalized (potential homoglyph attack)`;
        },
      },
    });
  };
}
