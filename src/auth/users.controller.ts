import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { changePasswordDto } from './dto/change-password-dto';
import { CreateUserDto } from './dto/create.user.dto';
import { UserDetails } from './entities/user.details.entity';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = new User();

    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (existingUser) throw new BadRequestException('User already exists');
    user.name = createUserDto.name;
    user.username = createUserDto.username;
    user.email = createUserDto.email?.toLowerCase();
    user.password = await this.authService.hashPassword(createUserDto.password);

    const newUser = await this.usersRepository.save(user);

    const userDetails = new UserDetails();
    userDetails.user = newUser;
    await this.userDetailsRepository.save(userDetails);

    return {
      ...newUser,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Post('change-password-with-token')
  async changePassword(@Body() changePasswordDto: changePasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { email: changePasswordDto.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerificationToken !== changePasswordDto.token) {
      throw new BadRequestException('Invalid token');
    }

    user.password = await this.authService.hashPassword(
      changePasswordDto.password,
    );

    user.emailVerificationToken = randomBytes(100).toString('hex');

    await this.usersRepository.save(user);

    return {
      message: 'Password changed successfully',
    };
  }
}
