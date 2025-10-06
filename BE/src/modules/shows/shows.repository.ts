import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { Shows } from 'src/database/entities/Shows';
import { Tickets } from 'src/database/entities/Tickets';
import { Repository } from 'typeorm';

@Injectable()
export class ShowsRepository extends BaseRepository<Shows> {
  constructor(@InjectRepository(Shows) showsRepo: Repository<Shows>) {
    super(showsRepo);
  }

  async findAllByEvent(eventId: number): Promise<Shows[]> {
    return this.repository.find({
      where: { event_id: eventId },
      relations: ['tickets'],
    });
  }

  async findById(showId: number): Promise<Shows | null> {
    return this.repository.findOne({
      where: { id: showId },
      relations: ['tickets']
    });
  }

  async getTicketsByShow(id: number): Promise<any> {
    const show = await this.findById(id);
    if (!show) {
      throw new HttpException('Show not found', HttpStatus.NOT_FOUND);
    }

    const now = new Date();

    const result = await this.repository
      .createQueryBuilder('show')
      .innerJoinAndSelect('show.event', 'events')
      .innerJoinAndSelect('show.tickets', 'tickets')
      .where('show.id =:id', { id })
      // .andWhere('show.time_start > :now', { now })
      .getOne();

    if (!result) {
      throw new HttpException(
        'Show not available or already started',
        HttpStatus.BAD_REQUEST,
      );
    }

    return result;
  }

  async findOneById(showId: number): Promise<Shows | null> {
    return this.repository.findOne({
      where: { id: showId },
      relations: ['tickets']
    });
  }
}
