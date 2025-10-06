import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { Events } from 'src/database/entities/Events';

@Injectable()
export class EventsRepository extends BaseRepository<Events> {
  constructor(@InjectRepository(Events) repo: Repository<Events>) {
    super(repo);
  }

  async findBySlug(slug: string) {
    const event = await this.repository.findOne({ where: { slug } });
    if (!event) {
      throw new NotFoundException(`Event with id ${slug} not found`);
    }
    return event;
  }

  async findById(id: number) {
    const event = await this.repository.findOne({ 
      where: { id },
      relations: {
        shows: {
          tickets: true,
        },
        settings: true,
      },
    });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }
}

