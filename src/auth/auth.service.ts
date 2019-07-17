import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) { }

  async signUp(dto: AuthCredentialsDto): Promise<void> {
    await this.userRepository.signUp(dto);
  }

  async signIn(dto: AuthCredentialsDto): Promise<string> {
    const username = await this.userRepository.validateCredentials(dto);
    if (!username) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return username;
  }
}
