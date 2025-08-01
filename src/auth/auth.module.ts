// auth/auth.module.ts
// there is some fault in here
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GoogleStrategy, JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
