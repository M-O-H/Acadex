import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

const ARABIC_BLOCK =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_ONLY = /^[a-zA-Z\s'-]+$/;
const CONFUSABLE_RANGES = [
  '\u0400-\u04FF',
  '\u0370-\u03FF',
  '\u1F00-\u1FFF',
  '\u0400-\u047F',
  '\u0500-\u052F',
];
const BIDIRECTIONAL_CHARS = /[\u200E\u200F\u202A-\u202E]/;
const NUMERIC_CHARS = /[0-9]/;

export type NameScript = 'ARABIC' | 'LATIN';

export function IsSafeName(
  script: NameScript,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSafeName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string' || !value.trim()) {
            return false;
          }

          const name = value.trim();

          if (BIDIRECTIONAL_CHARS.test(name)) {
            return false;
          }

          if (hasConfusableCharacters(name)) {
            return false;
          }

          if (script === 'ARABIC') {
            return validateArabicName(name);
          } else {
            return validateLatinName(name);
          }
        },
        defaultMessage(args: ValidationArguments): string {
          const scriptType = args.constraints?.[0] || 'LATIN';
          if (scriptType === 'ARABIC') {
            return `${args.property} must contain only Arabic letters`;
          }
          return `${args.property} must contain only English letters (a-z, A-Z)`;
        },
      },
      constraints: [script],
    });
  };
}

function hasConfusableCharacters(name: string): boolean {
  for (const char of name) {
    const code = char.charCodeAt(0);
    if (
      (code >= 0x0370 && code <= 0x03ff) ||
      (code >= 0x0400 && code <= 0x04ff) ||
      (code >= 0x0500 && code <= 0x052f) ||
      (code >= 0x1f00 && code <= 0x1fff) ||
      (code >= 0x2c00 && code <= 0x2c5f) ||
      (code >= 0x1e00 && code <= 0x1eff)
    ) {
      return true;
    }
  }
  return false;
}

function validateArabicName(name: string): boolean {
  if (LATIN_ONLY.test(name)) {
    return false;
  }
  if (NUMERIC_CHARS.test(name)) {
    return false;
  }
  const arabicChars = name.match(ARABIC_BLOCK);
  if (!arabicChars || arabicChars.length === 0) {
    return false;
  }
  const latinChars = name.match(/[a-zA-Z]/g);
  if (latinChars && latinChars.length > 0) {
    return false;
  }
  return true;
}

function validateLatinName(name: string): boolean {
  if (!LATIN_ONLY.test(name)) {
    return false;
  }
  return true;
}
