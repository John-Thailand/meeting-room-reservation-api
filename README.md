# 概要

コワーキングスペースの会議室の予約を行うことができるAPI

## 動作確認の手順

① プロジェクト直下で yarn run start:dev を実行してAPIを起動

② プロジェクト直下で docker compose up -d を実行してMySQLが含まれたコンテナを起動

③ MySQLWorkBenchを起動し、docker-compose.yml を参考にMySQLとのコネクションを作成

④ 下記のコマンドを実行して、テーブルを作成する

CREATE TABLE app_db.coworking_spaces (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO app_db.coworking_spaces (id, name, open_time, close_time) VALUES (UUID(), '福岡コワーキングスペース', '09:00:00', '21:00:00'); 

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

INSERT INTO app_db.users (id, email, password, constract_start_date) VALUES (UUID(), 'test@gmail.com', 'tesT1234_', '2025-06-01');
