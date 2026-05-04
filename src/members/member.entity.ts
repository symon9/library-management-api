import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MembershipType {
  BASIC = 'basic',
  PREMIUM = 'premium',
}

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: MembershipType,
    default: MembershipType.BASIC,
  })
  membershipType: MembershipType;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  joinDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
