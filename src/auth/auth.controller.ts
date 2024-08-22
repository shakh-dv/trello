import {Body, Controller, Post, Put, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignInDTO, SignInResultDTO} from './dtos/sign-in.dto';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {AuthGuard} from './guards/auth.guard';
import {
  ResetPasswordDTO,
  ResetPasswordResultDTO,
} from './dtos/reset-password.dto';
import {GetAccessTokenPayload} from './decorators/access-token-payload';
import {AccessTokenPayload} from './types/access-token-payload';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() data: SignInDTO): Promise<SignInResultDTO> {
    return this.authService.signIn(data);
  }

  @UseGuards(AuthGuard)
  @Put('reset-password')
  resetPassword(
    @Body() data: ResetPasswordDTO,
    @GetAccessTokenPayload() accessTokenPayload: AccessTokenPayload
  ): Promise<ResetPasswordResultDTO> {
    return this.authService.resetPassword(data, accessTokenPayload);
  }
}
