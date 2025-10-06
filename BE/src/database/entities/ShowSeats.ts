import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Shows } from './Shows';
import { SEAT_STATUS } from '../../common/enums/seat_status.enum';
import { Seats } from './Seats';

@Entity('show_seats')
export class ShowSeats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  show_id: number;

  @ManyToOne(() => Shows, s => s.id, { onDelete: 'CASCADE' })
  show: Shows;

  @Column({ type: 'int' })
  seat_id: number;

  @ManyToOne(() => Seats, s => s.id, { onDelete: 'CASCADE' })
  seat: Seats;

  @Column({ type: 'enum', enum: SEAT_STATUS })
  status: SEAT_STATUS;

  @Column({ type: 'int', nullable: true })
  reserved_by_user_id: number | null;
  
  @Column({ type: 'datetime', nullable: true })
  reserved_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  reserved_until: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
}