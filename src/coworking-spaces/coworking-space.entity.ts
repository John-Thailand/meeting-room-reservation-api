import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CoworkingSpace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  // TODO: MySQLの場合はtypeを'time'にしておく
  @Column({ type: 'text' })
  open_time: string;

  // TODO: MySQLの場合はtypeを'time'にしておく
  @Column({ type: 'text' })
  close_time: string;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
