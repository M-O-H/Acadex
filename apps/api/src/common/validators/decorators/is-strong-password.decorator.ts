import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return false;
          if (value.length < 12) return false;
          if (!/[A-Z]/.test(value)) return false;
          if (!/[a-z]/.test(value)) return false;
          if (!/[0-9]/.test(value)) return false;
          const specialChars = '!@#$%^&*()_+-=[]{}|;';
          if (!specialChars.split('').some((c) => value.includes(c)))
            return false;
          return true;
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be at least 12 characters long and contain uppercase, lowercase, number, and special character`;
        },
      },
    });
  };
}
