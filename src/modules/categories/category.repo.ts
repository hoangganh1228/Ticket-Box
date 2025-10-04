import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { Categories } from 'src/database/entities/Categories';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository extends BaseRepository<Categories> {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryRepo: Repository<Categories>,
  ) {
    super(categoryRepo);
  }

  async getCategories(): Promise<Categories[]> {
    return this.categoryRepo.find({});
  }
}
