import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Logger, ConflictException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async signUp({ username, password }: AuthCredentialsDto): Promise<void> {
    this.logger.verbose(`Creating user for ${username}`);
    const user = await this.create({ username, password });
    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(`Username already exists`);
      }
      throw e;
    }
  }
}
