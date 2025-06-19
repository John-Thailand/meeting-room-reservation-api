import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // ユニーク制約で同じメールアドレスを登録できないようにする
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  is_administrator: boolean;

  @Column()
  contract_start_date: Date;

  @Column({ type: 'datetime', nullable: true, default: null })
  withdrawal_date: Date;

  // datetime型：日付 + 時刻（2025-06-20 12:34:56）
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
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
