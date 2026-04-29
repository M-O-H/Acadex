export declare class OtpService {
    private readonly logger;
    generateOtp(): string;
    sendSms(phone: string, code: string): Promise<void>;
    sendEmail(to: string, code: string): Promise<void>;
}
