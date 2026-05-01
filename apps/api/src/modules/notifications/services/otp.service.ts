import { Injectable, Logger } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  generateOtp(): string {
    return randomInt(1000, 9999).toString();
  }

  sendSms(phone: string, code: string): void {
    this.logger.log(`[MOCK SMS] To: ${phone} | Code: ${code}`);
  }

  sendEmail(to: string, code: string): void {
    this.logger.log(`[MOCK EMAIL] To: ${to} | Verification code: ${code}`);
  }
}
