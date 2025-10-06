import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import { Orders } from './Orders';
import { Tickets } from './Tickets';
import { Shows } from './Shows';

@Entity('order_items')
export class OrderItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column()
  ticket_id: number;

  @Column()
  show_id: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_price: number; // Giá gốc

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_price: number; // Tổng tiền = unit_price * quantity

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount_amount: number; // Giảm giá cho item này

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  final_price: number;

  @Column({ length: 255, nullable: true })
  special_requests: string; // Yêu cầu đặc biệt

  @Column({ type: 'int', nullable: true })
  seat_id: number | null; // gắn ghế cụ thể

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Orders, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: Orders;

  @ManyToOne(() => Tickets, (ticket) => ticket.orderItems)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Tickets;

  @ManyToOne(() => Shows, (show) => show.orderItems)
  @JoinColumn({ name: 'show_id' })
  show: Shows;
}