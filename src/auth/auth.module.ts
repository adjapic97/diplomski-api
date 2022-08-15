import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard';
import { JwtStrategy } from './strategy';

@Module({
    imports: [JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
            secret: config.get('JWT_SECRET'),
            signOptions: {expiresIn: '15m'},
        }),
    })],
    controllers: [AuthController],
    providers: [AuthService, JwtGuard, JwtStrategy]
})
export class AuthModule {}