import { ConflictException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

const hashPassword = async (password: string, salt: string): Promise<string> =>
  bcrypt.hash(password, salt);

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async signUp({ username, password }: AuthCredentialsDto): Promise<void> {
    this.logger.verbose(`Creating user for ${username}`);
    const salt = await bcrypt.genSalt();
    const user = await this.create({
      username,
      password: await hashPassword(password, salt),
      salt,
    });

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(`Username already exists`);
      }
      throw e;
    }
  }

  async validateCredentials({
    username,
    password,
  }: AuthCredentialsDto): Promise<string> {
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return username;
    }
    return null;
  }
}
