import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { PaymentEvent } from "src/database/entities/PaymentEvent";
import { Repository } from "typeorm";

@Injectable()
export class PaymentEventRepository extends BaseRepository<PaymentEvent> {
  constructor(@InjectRepository(PaymentEvent) repo: Repository<PaymentEvent>) {
    super(repo)
  }

  async findByEventId(eventId: number) {
    return this.repository.find({ where: { event_id: eventId } });
  }
}