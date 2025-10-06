import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Users } from './Users';
import { RefundTransactions } from './RefundTransactions';

@Entity('payment_transactions')
export class PaymentTransactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  order_code: string; // Mã đơn hàng từ hệ thống bạn

  @Column()
  user_id: number;

  @ManyToOne(() => Users, (user) => user.payment_transactions)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  /** Cổng thanh toán: vnpay, momo,... */
  @Column({ length: 50 })
  payment_gateway: string;

  @Column({ length: 45, nullable: true })
  ip_address: string;

  /** Mã giao dịch từ cổng thanh toán */
  @Column({ length: 100, nullable: true })
  gateway_transaction_id: string; //vnp gửi lại khi callback

  /** Số tiền thanh toán */
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  /** pending | success | failed | canceled */
  @Column({
    name: 'status',
    type: 'enum',
    enum: ['PENDING', 'SUCCESS', 'FAILED','CANCELED'],
    default: 'PENDING',
  })
  status : 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELED';

  @Column({ type: 'text', nullable: true })
  request_data: string; // Toàn bộ params đã ký gửi đi VNPay

  /** Dữ liệu callback từ cổng thanh toán */
  @Column({ type: 'text', nullable: true })
  callback_data: string;
  
  /** Thời gian thanh toán thành công */
  @Column({ type: 'datetime', nullable: true })
  paid_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => RefundTransactions, (refund) => refund.payment_transaction)
  refund: RefundTransactions;
}
