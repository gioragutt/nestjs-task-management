import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) { }

  async signUp(dto: AuthCredentialsDto): Promise<void> {
    await this.userRepository.signUp(dto);
  }
}
