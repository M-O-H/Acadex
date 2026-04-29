export declare abstract class StringSanitizer {
    static normalizeUnicode(input: string): string;
    static toASCII(input: string): string;
    static trimAndNormalize(input: string): string;
    static removeControlCharacters(input: string): string;
    static removeInvisibleCharacters(input: string): string;
    static sanitizeFilename(input: string): string;
    static stripHTML(input: string): string;
}
