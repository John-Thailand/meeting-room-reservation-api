# 概要

コワーキングスペースの会議室の予約を行うことができるAPI

## 動作確認の手順

① プロジェクト直下で yarn run start:dev を実行してAPIを起動

② プロジェクト直下で docker compose up -d を実行してMySQLが含まれたコンテナを起動

③ MySQLWorkBenchを起動し、docker-compose.yml を参考にMySQLとのコネクションを作成

④ 下記のコマンドを実行して、テーブルを作成する

BEGIN;

CREATE TABLE app_db.coworking_spaces (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE app_db.users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(60) NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  constract_start_date DATE NOT NULL,
  withdrawal_date DATE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE app_db.business_holidays (
  id CHAR(36) PRIMARY KEY,
  coworking_space_id CHAR(36) NOT NULL,
  business_holiday DATE NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (coworking_space_id) REFERENCES coworking_spaces(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_space_holiday (coworking_space_id, business_holiday)
);

CREATE TABLE app_db.meeting_rooms (
  id CHAR(36) PRIMARY KEY,
  coworking_space_id CHAR(36) NOT NULL,
  name VARCHAR(30) NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (coworking_space_id) REFERENCES coworking_spaces(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_space_meeting (coworking_space_id, name)
);

CREATE TABLE app_db.reservations (
  id CHAR(36) PRIMARY KEY,
  meeting_room_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (meeting_room_id) REFERENCES meeting_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

COMMIT;

INSERT INTO app_db.coworking_spaces (id, name, open_time, close_time) VALUES (UUID(), '福岡コワーキングスペース', '09:00:00', '21:00:00'); 

INSERT INTO app_db.users (id, email, password, constract_start_date) VALUES (UUID(), 'test@gmail.com', 'tesT1234_', '2025-06-01');

INSERT INTO app_db.business_holidays (id, coworking_space_id, business_holiday) VALUES (UUID(), '5378bd7d-5417-11f0-a1cb-0242ac1b0002', '2025-06-12');

INSERT INTO app_db.reservations (id, meeting_room_id, user_id, start_datetime, end_datetime) VALUES (UUID(), '96530dac-548b-11f0-ae2e-0242ac1b0002', '6f616325-541b-11f0-92d1-0242ac1b0002', '2025-06-27 06:00:00', '2025-06-27 06:00:00');

INSERT INTO app_db.meeting_rooms (id, coworking_space_id, name) VALUES (UUID(), '5378bd7d-5417-11f0-a1cb-0242ac1b0002', '会議室A');
