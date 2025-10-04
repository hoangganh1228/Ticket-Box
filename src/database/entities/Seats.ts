import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('seats')
export class Seats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 4 })
  seat_code: string; // A1, A2, ..., J9

  @Column({ type: 'varchar', length: 50, nullable: true })
  zone: string; // VIP, Standard... (để mở rộng sau này)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
