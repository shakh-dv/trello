import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from 'src/users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {JwtStrategy} from './strategies/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      useFactory(configService: ConfigService) {
        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN'),
          },
        };
      },
      global: true,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ConfigService],
  exports: [AuthService, JwtStrategy, ConfigService],
})
export class AuthModule {}
