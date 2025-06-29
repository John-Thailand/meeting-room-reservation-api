import { MinDate } from "class-validator";
import { CoworkingSpace } from "src/coworking-spaces/coworking-space.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('business_holidays')
export class BusinessHoliday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 多くのBusinessHolidayが１つのCoworkingSpaceに属する
  // 親であるCoworkingSpaceが削除されたときに、自動でこのBusinessHolidayも削除されるようにする
  @ManyToOne(() => CoworkingSpace, { onDelete: 'CASCADE', nullable: false })
  // 外部キーのカラム名をcoworking_space_idとする
  @JoinColumn({ name: 'coworking_space_id' })
  coworkingSpace: CoworkingSpace;

  @Column({ name: 'coworking_space_id', nullable: false })
  coworking_space_id: string;

  @Column({ type: 'date', nullable: false })
  business_holiday: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', nullable: false })
  updated_at: Date;
}
