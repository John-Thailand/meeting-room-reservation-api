import { CoworkingSpace } from "src/coworking-spaces/coworking-space.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BusinessHoliday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 多くのBusinessHolidayが１つのCoworkingSpaceに属する
  // 親であるCoworkingSpaceが削除されたときに、自動でこのBusinessHolidayも削除されるようにする
  @ManyToOne(() => CoworkingSpace, { onDelete: 'CASCADE' })
  // 外部キーのカラム名をcoworking_space_idとする
  @JoinColumn({ name: 'coworking_space_id' })
  coworkingSpace: CoworkingSpace;

  @Column({ name: 'coworking_space_id' })
  coworking_space_id: string;

  @Column({ type: 'datetime' })
  business_holiday: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
