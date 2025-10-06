import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Events } from './Events';
import { BUSINESS_TYPE } from '../../../src/common/enums/paymentEvent.enum';
import { BaseEntity } from '../../../src/common/base/base.entity';

@Entity('payment_event')
export class PaymentEvent extends BaseEntity {

  @Column()
  event_id: number;

  @Column({ length: 255 })
  account_name: string;

  @Column({ length: 255 })
  account_number: string;

  @Column({ length: 255 })
  bank_name: string;

  @Column({ length: 255, nullable: true })
  local_branch: string;

  @Column({
    type: 'enum',
    enum: BUSINESS_TYPE,
    default: BUSINESS_TYPE.PERSONAL,
  })
  business_type: BUSINESS_TYPE;

  @ManyToOne(() => Events, (event) => event.paymentEvents)
  @JoinColumn({ name: 'event_id' })
  event: Events;
}
