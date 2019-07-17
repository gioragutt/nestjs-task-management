import { Controller, Post, ValidationPipe, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signUp(@Body(ValidationPipe) dto: AuthCredentialsDto): Promise<void> {
    await this.authService.signUp(dto);
  }
}
