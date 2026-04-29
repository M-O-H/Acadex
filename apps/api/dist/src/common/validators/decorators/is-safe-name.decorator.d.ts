import { ValidationOptions } from 'class-validator';
export type NameScript = 'ARABIC' | 'LATIN';
export declare function IsSafeName(script: NameScript, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
