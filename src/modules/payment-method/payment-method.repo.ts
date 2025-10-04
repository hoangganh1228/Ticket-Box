import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { PaymentMethod } from 'src/database/entities/PaymentMethod';
import { Repository } from "typeorm";

@Injectable()

export class PaymentMethodRepo extends BaseRepository<PaymentMethod> {
    constructor(@InjectRepository(PaymentMethod) private readonly paymentMethodRepo : Repository<PaymentMethod> ){
        super(paymentMethodRepo);
    }
}