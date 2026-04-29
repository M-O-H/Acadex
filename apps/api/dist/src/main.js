"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const validate_headers_interceptor_1 = require("./common/interceptors/validate-headers.interceptor");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['log', 'error', 'warn'],
    });
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        stopAtFirstError: true,
        transformOptions: {
            enableImplicitConversion: false,
        },
    }));
    app.useGlobalInterceptors(new validate_headers_interceptor_1.ValidateHeadersInterceptor(), new logging_interceptor_1.LoggingInterceptor());
    const port = process.env.PORT || 3000;
    await app.listen(port);
    const logger = new common_1.Logger('bootstrap');
    logger.log(`Application is running on: http://localhost:${port}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map