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
import { PaymentTransactions } from './PaymentTransaction';

@Entity('refund_transactions')
export class RefundTransactions {
  @PrimaryGeneratedColumn()
  id: number;

  /** Liên kết đến giao dịch thanh toán gốc */
  @Column()
  payment_transaction_id: number;

  // RefundTransactions
  @OneToOne(() => PaymentTransactions, (payment) => payment.refund)
  @JoinColumn({ name: 'payment_transaction_id' }) 
  payment_transaction: PaymentTransactions;

  /** Người yêu cầu hoàn tiền */
  @Column()
  user_id: number;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  /** Số tiền hoàn */
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  refund_amount: number;

  /** pending | success | failed */
  @Column({
    type: 'enum',
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'SUCCESS' | 'FAILED';

  /** Lý do hoàn tiền */
  @Column({ type: 'varchar', length: 255, nullable: true })
  reason: string;

  /** Mã giao dịch hoàn tiền từ cổng thanh toán (nếu có) */
  @Column({ length: 100, nullable: true })
  gateway_refund_id: string;

  /** Dữ liệu callback hoàn tiền từ VNPay hoặc cổng thanh toán */
  @Column({ type: 'text', nullable: true })
  callback_data: string;

  /** Thời gian hoàn tiền thành công */
  @Column({ type: 'datetime', nullable: true })
  refunded_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
