import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  meeting_room_id: string;

  @Column({ type: 'text', nullable: false })
  user_id: string;

  @Column({ type: 'datetime', nullable: false })
  start_datetime: Date;

  @Column({ type: 'datetime', nullable: false })
  end_datetime: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', nullable: false })
  updated_at: Date;
}
