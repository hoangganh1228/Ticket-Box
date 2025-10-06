// src/common/base.controller.ts
import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { BaseService } from './base.service';

export class BaseController<
  T extends ObjectLiteral,
  ID extends number | string = number,
> {
  constructor(protected readonly service: BaseService<T, ID>) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id as unknown as ID);
  }

  @Post()
  create(@Body() dto: Partial<T>) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<T>) {
    return this.service.update(id as unknown as ID, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id as unknown as ID);
  }
}
