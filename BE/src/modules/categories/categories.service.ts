import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { Categories } from 'src/database/entities/Categories';
import { CategoryRepository } from './category.repo';

@Injectable()
export class CategoriesService extends BaseService<Categories> {
  constructor(private categoryRepo: CategoryRepository) {
    super(categoryRepo);
  }
}
