export declare enum CertificateType {
    SUDANESE = "SUDANESE",
    ARABIAN = "ARABIAN",
    FOREIGN = "FOREIGN"
}
export declare class StudentRegisterDto {
    fullNameAr: string;
    fullNameEn: string;
    dateOfBirth: string;
    phone: string;
    personalEmail: string;
    address: string;
    certificateType: CertificateType;
    nationality: string;
}
export declare class VerifyOtpDto {
    email: string;
    code: string;
    type: CertificateType;
}
export declare class ResendOtpDto {
    email: string;
    type: CertificateType;
}
export declare class ApproveStudentDto {
    notes?: string;
}
export declare class RejectStudentDto {
    reason: string;
}
