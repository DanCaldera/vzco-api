import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';
import { UpdateWaitlistDto } from './dto/update-waitlist.dto';
import { VerifyEmailWaitlistDto } from './dto/verify-email-waitlist.dto';
import { Waitlist } from './entities/waitlist.entity';

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(Waitlist)
    private readonly waitlistRepository: Repository<Waitlist>,
  ) {}

  async create(createWaitlistDto: CreateWaitlistDto) {
    return this.waitlistRepository.save(createWaitlistDto);
  }

  async findAll() {
    return this.waitlistRepository.find();
  }

  async findOne(id: number) {
    const waitlist = await this.waitlistRepository.findOne({
      where: {
        id,
      },
    });

    if (!waitlist) {
      throw new Error('Waitlist not found');
    }

    return waitlist;
  }

  async verifyEmailIsAbleToSignup(
    verifyEmailWaitlistDto: VerifyEmailWaitlistDto,
  ) {
    const waitlist = await this.waitlistRepository.findOne({
      where: {
        email: verifyEmailWaitlistDto.email,
        signUpEnabled: true,
      },
    });

    if (waitlist) {
      return true;
    } else {
      return false;
    }
  }

  async update(id: number, updateWaitlistDto: UpdateWaitlistDto) {
    return this.waitlistRepository.update(id, updateWaitlistDto);
  }

  async remove(id: number) {
    return this.waitlistRepository.delete(id);
  }
}
