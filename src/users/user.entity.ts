import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ユニーク制約で同じメールアドレスを登録できないようにする
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_administrator: boolean;

  @Column({ type: 'datetime', nullable: false })
  contract_start_date: Date;

  @Column({ type: 'datetime', nullable: true, default: null })
  withdrawal_date: Date;

  // datetime型：日付 + 時刻（2025-06-20 12:34:56）
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', nullable: false })
  updated_at: Date;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id)
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Userwith id', this.id)
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id)
  }
}
