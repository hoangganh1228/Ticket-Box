import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { Events } from './Events';
import { ORDER_STATUS } from '../../common/enums/order_status.enum';
import { Payments } from './Payments';
import { OrderItems } from './OrderItems';
import { BaseEntity } from '../../common/base/base.entity';
import { PaymentMethod } from './PaymentMethod';
import { PaymentStatus } from './PaymentStatus';
import { Shows } from './Shows';

@Entity('orders')
export class Orders extends BaseEntity {

  @Column({ length: 30, nullable: true })
  order_number: string;

  @Column()
  user_id: number;

  @Column()
  event_id: number;
  @Column({ length: 30, nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: ORDER_STATUS, default: ORDER_STATUS.PENDING })
  status: ORDER_STATUS;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount_amount: number; // Giảm giá

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  final_amount: number;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  province: string;

  @Column({ length: 255, nullable: true })
  district: string;

  @Column({ length: 255, nullable: true })
  ward: string;

  @Column({ length: 255, nullable: true })
  street: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 255, nullable: true })
  note: string;

  @Column({ length: 255, nullable: true, unique: true })
  idempotency_key: string;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Events, (event) => event.orders)
  @JoinColumn({ name: 'event_id' })
  event: Events;
  @OneToMany(() => OrderItems, (orderItem) => orderItem.order)
  @JoinColumn({ name: 'order_id' })
  orderItems: OrderItems[];

  @OneToMany(() => Payments, (payment) => payment.order)
  payments: Payments[];

}
