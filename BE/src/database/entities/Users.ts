import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Orders } from './Orders';
import { Payments } from './Payments';
import { EventMemberships } from './EventMemberships';
import { Events } from './Events';
import { USER_GENDER } from '../../common/enums/user.enum';
import { Exclude } from 'class-transformer';
import { Roles } from './Roles';
import { BaseEntity } from '../../common/base/base.entity';
import { PaymentTransactions } from './PaymentTransaction';

@Entity('users')
export class Users extends BaseEntity {
  @Column({ length: 255, nullable: true })
  username: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 30, nullable: true })
  phone: string;

  @Column({ length: 50, unique: true, nullable: true })
  slug: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ length: 255 })
  @Exclude()
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  role_id: number;

  @Column({
    type: 'enum',
    enum: USER_GENDER,
    nullable: true,
  })
  gender: USER_GENDER;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];

  @OneToMany(() => Roles, (role) => role.id)
  role: Roles;

  @OneToMany(() => EventMemberships, (membership) => membership.user)
  eventMemberships: EventMemberships[];

  @OneToMany(() => Events, (event) => event.created_by)
  createdEvents: Events[];
  @OneToMany(() => Payments, (payment) => payment.user)
  payments: Payments[];
  @OneToMany(() => PaymentTransactions, (payment_transaction) => payment_transaction.user)
  payment_transactions: PaymentTransactions[];
}
