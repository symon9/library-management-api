import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  //GET all
  findAll(): Promise<Member[]> {
    return this.memberRepo.find();
  }

  //GET by ID
  async findOne(id: string): Promise<Member> {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member)
      throw new NotFoundException(`Member with ID "${id}" not found`);
    return member;
  }

  //CREATE
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

  //PATCH
  async update(id: string, dto: UpdateMemberDto): Promise<Member> {
    await this.findOne(id);
    await this.memberRepo.update(id, dto);
    return this.findOne(id);
  }

  //DELETE
  async deactivate(id: string): Promise<Member> {
    const member = await this.findOne(id);
    member.isActive = false;
    return this.memberRepo.save(member);
  }
}
