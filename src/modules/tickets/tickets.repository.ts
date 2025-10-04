import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { Tickets } from 'src/database/entities/Tickets';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TicketsRepository extends BaseRepository<Tickets> {
  constructor(@InjectRepository(Tickets) repo: Repository<Tickets>) {
    super(repo);
  }

  async getTicketById(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['show'] });
  }
}
