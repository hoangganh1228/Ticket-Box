import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { Settings } from "src/database/entities/Settings";
import { Repository } from "typeorm";

@Injectable()
export class SettingsRepository extends BaseRepository<Settings> {
  constructor(@InjectRepository(Settings) repo: Repository<Settings>) {
    super(repo)
  }

  async findByEventId(eventId: number) {
    return this.repository.find({ where: { event_id: eventId } });
  }
}