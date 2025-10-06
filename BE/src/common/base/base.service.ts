// src/common/base.service.ts
import { NotFoundException } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, ObjectLiteral } from 'typeorm';
import { BaseRepository } from './base.repository';

export class BaseService<
  T extends ObjectLiteral,
  ID extends number | string = number,
> {
  constructor(protected readonly repo: BaseRepository<T>) { }

  findAll(options?: FindManyOptions<T>) {
    return this.repo.findAll(options);
  }
  findOneOptions(options: FindOneOptions<T>) {
    return this.repo.findOne(options);
  }

  async findById(id: ID, options?: Omit<FindOneOptions<T>, 'where'>) {
    // you can pass everything that findOne accept include: elations, select, withDeleted, loadRelationIds, cache, lock,...but exclude where
    const item = await this.repo.findOne({
      ...(options || {}),
      where: { id } as any,
    });
    if (!item) throw new NotFoundException(`Resource with id ${id} not found`);
    return item;
  }

  create(dto: Partial<T>) {
    return this.repo.create(dto as any);
  }

  async update(id: ID, dto: Partial<T>) {
    const updated = await this.repo.update(id as any, dto as any);
    return updated;
  }

  async delete(id: ID) {
    await this.repo.delete(id as any);
    return { deleted: true };
  }
}
