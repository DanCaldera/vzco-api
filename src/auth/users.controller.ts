import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = new User();
    if (createUserDto.password !== createUserDto.retypePassword)
      throw new BadRequestException('Passwords do not match');
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (existingUser) throw new BadRequestException('User already exists');
    user.name = createUserDto.name;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = await this.authService.hashPassword(createUserDto.password);
    return {
      ...(await this.usersRepository.save(user)),
      token: this.authService.getTokenForUser(user),
    };
  }
}
