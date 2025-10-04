import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './Users';
import {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from '../../common/enums/payment.enum';
import { Orders } from './Orders';
import { BaseEntity } from '../../common/base/base.entity';

@Entity('payments')
export class Payments extends BaseEntity{

  @Column()
  user_id: number;

  @Column()
  order_id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 10, default: 'VND' })
  currency: string;

  @Column({ length: 40 })
  provider: string;

  @Column({ type: 'enum', enum: PAYMENT_METHOD })
  method: PAYMENT_METHOD;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.PENDING,
  })
  status: PAYMENT_STATUS;

  @Column({ length: 100, nullable: true })
  transaction_id: string;

  @Column({ length: 255, nullable: true })
  failure_msg: string;

  @ManyToOne(() => Users, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Orders, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Orders;
}
