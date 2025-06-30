import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('meeting_rooms')
export class MeetingRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  coworking_space_id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', nullable: false })
  updated_at: Date;
}
