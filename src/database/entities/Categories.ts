import { Entity, Column, OneToMany } from 'typeorm';
import { Events } from './Events';
import { BaseEntity } from '../../common/base/base.entity';

@Entity('categories')
export class Categories extends BaseEntity {
  @Column({ length: 50, unique: true })
  slug: string;

  @Column({ length: 120 })
  name: string;

  @OneToMany(() => Events, (event) => event.category)
  events: Events[];
}
