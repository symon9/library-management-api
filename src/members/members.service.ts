import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  async findAll(): Promise<Member[]> {
    return this.memberRepo.find();
  }

  async findOne(id: number): Promise<Member> {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Member with ID "${id}" not found`);
    }
    return member;
  }

  async create(dto: CreateMemberDto): Promise<Member> {
    const existing = await this.memberRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException(
        `A member with email "${dto.email}" already exists`,
      );
    }

    const member = this.memberRepo.create(dto);
    return this.memberRepo.save(member);
  }

  async update(id: number, dto: UpdateMemberDto): Promise<Member> {
    await this.findOne(id);
    await this.memberRepo.update(id, dto);
    return this.findOne(id);
  }

  async deactivate(id: number): Promise<{ message: string }> {
    const member = await this.findOne(id);
    member.isActive = false;
    await this.memberRepo.save(member);
    return { message: `Member "${member.name}" has been deactivated` };
  }
}
