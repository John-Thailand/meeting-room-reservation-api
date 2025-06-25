import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class MeetingRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  coworking_space_id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
