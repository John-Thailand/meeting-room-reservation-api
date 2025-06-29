import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('coworking_spaces')
export class CoworkingSpace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'time', nullable: false })
  open_time: string;

  @Column({ type: 'time', nullable: false })
  close_time: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', nullable: false })
  updated_at: Date;
}
