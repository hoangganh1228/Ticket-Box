import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';

@Injectable()
export class BaseRepository<T extends ObjectLiteral> {
  // ObjectLiteral present for key-value
  constructor(protected readonly repository: Repository<T>) {}

  findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }
  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repository.findAndCount(options);
  }

  findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }
  save(data: any): Promise<T> {
    return this.repository.save(data);
  }

  update(id: number, data: DeepPartial<T>): Promise<T> {
    return this.repository.save({ ...data, id } as any);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
    return undefined;
  }
  async deleteMany(options): Promise<void> {
    await this.repository.delete(options);
    return undefined;
  }

  async paginate(
    options: FindManyOptions<T>,
    pagination: { page?: number; limit?: number },
  ) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const [data, total] = await this.repository.findAndCount({
      ...options,
      skip,
      take: limit,
    });

    return {
      data,
      pagination: {
        totalItem: total,
        currentPage: page,
        totalPage: Math.ceil(total / limit),
      },
    };
  }
  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }
}
