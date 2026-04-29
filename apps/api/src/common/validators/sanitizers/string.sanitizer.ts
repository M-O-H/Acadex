/* eslint-disable no-control-regex */
export abstract class StringSanitizer {
  static normalizeUnicode(input: string): string {
    return input.normalize('NFC');
  }

  static toASCII(input: string): string {
    return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  static trimAndNormalize(input: string): string {
    return input.trim().normalize('NFC');
  }

  static removeControlCharacters(input: string): string {
    return input
      .replace(/[\x00-\x1F\x7F]/g, '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '');
  }

  static removeInvisibleCharacters(input: string): string {
    return input
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/[\u200E\u200F\u202A-\u202E]/g, '');
  }

  static sanitizeFilename(input: string): string {
    return input
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  static stripHTML(input: string): string {
    return input.replace(/<[^>]*>/g, '').trim();
  }
}
