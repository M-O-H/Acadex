"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(data) {
        this.logger.log(`Register attempt: ${data.email}`);
        const existing = await this.usersService.findByEmail(data.email);
        if (existing) {
            this.logger.warn(`Registration failed - email exists: ${data.email}`);
            throw new common_1.ConflictException('Email already exists');
        }
        const user = await this.usersService.create({
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
        });
        const token = this.generateToken(user.id, user.email, user.role);
        this.logger.log(`User registered: ${data.email}`);
        return {
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    async login(data) {
        this.logger.log(`Login attempt: ${data.email}`);
        const user = await this.usersService.findByEmail(data.email);
        if (!user) {
            this.logger.warn(`Login failed - user not found: ${data.email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.role === 'STUDENT' && !user.isApproved) {
            this.logger.warn(`Login failed - student not approved: ${data.email}`);
            throw new common_1.ForbiddenException('Account pending admin approval');
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            this.logger.warn(`Login failed - invalid password: ${data.email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.generateToken(user.id, user.email, user.role);
        this.logger.log(`User logged in: ${data.email}`);
        return {
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    generateToken(userId, email, role) {
        const payload = { sub: userId, email, role };
        return this.jwtService.sign(payload);
    }
    async validateUser(userId) {
        return this.usersService.findOne(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map