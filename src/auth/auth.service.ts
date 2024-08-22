import * as bcrypt from 'bcrypt';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';
import {SignInDTO, SignInResultDTO} from './dtos/sign-in.dto';
import {AccessTokenPayload} from './types/access-token-payload';
import {JwtService} from '@nestjs/jwt';
import {
  ResetPasswordDTO,
  ResetPasswordResultDTO,
} from './dtos/reset-password.dto';
import {BCRYPT_HASH_SALT} from './constants/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async generateHashPassword(password: string): Promise<string> {
    const salt = BCRYPT_HASH_SALT;
    return await bcrypt.hash(password, salt);
  }

  async verifyAccessToken(accessToken: string): Promise<AccessTokenPayload> {
    const payload: AccessTokenPayload =
      await this.jwtService.verifyAsync(accessToken);

    return payload;
  }

  async signIn(data: SignInDTO): Promise<SignInResultDTO> {
    const {email, password} = data;

    const user = await this.usersService.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if (!doesPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken({
      email: user.email,
      userId: user.id,
    });

    return {
      accessToken,
    };
  }

  //TODO: sign-up

  async resetPassword(
    data: ResetPasswordDTO,
    accessTokenPayload: AccessTokenPayload
  ): Promise<ResetPasswordResultDTO> {
    const user = await this.usersService.getByIdOrThrow(
      accessTokenPayload.userId
    );

    const doesPasswordMatch = await bcrypt.compare(
      data.oldPassword,
      user.password
    );

    if (!doesPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updatePassword(
      user.id,
      await bcrypt.hash(data.newPassword, BCRYPT_HASH_SALT)
    );
  }
}
