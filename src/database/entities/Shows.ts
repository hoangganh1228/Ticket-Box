import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Events } from './Events';
import { Tickets } from './Tickets';
import { OrderItems } from './OrderItems';
import { BaseEntity } from '../../common/base/base.entity';
import { Orders } from './Orders';

@Entity('shows')
export class Shows extends BaseEntity {
  @Column()
  event_id: number;

  @Column({ type: 'bool', nullable: true })
  is_free: boolean;

  @Column({ type: 'timestamp' })
  time_start: Date;

  @Column({ type: 'timestamp', nullable: true })
  time_end: Date;

  @ManyToOne(() => Events, (event) => event.shows)
  @JoinColumn({ name: 'event_id' })
  event: Events;

  @OneToMany(() => Tickets, (ticket) => ticket.show)
  tickets: Tickets[];

  @OneToMany(() => OrderItems, (orderItem) => orderItem.show)
  orderItems: OrderItems[];
}
