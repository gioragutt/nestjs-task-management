import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: AuthCredentialsDto): Promise<void> {
    await this.userRepository.signUp(dto);
  }

  async signIn(dto: AuthCredentialsDto) {
    const username = await this.userRepository.validateCredentials(dto);
    if (!username) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
