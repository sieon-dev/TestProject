-- 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 기본 관리자 계정 시드 (admin / admin1234)
INSERT INTO users (username, password_hash)
VALUES ('admin', '$2b$10$F83YXPp8jdrSCrjStN5.s.gDrkM8aTtWP/8cli0gPdmhvx06eRa5K')
ON CONFLICT (username) DO NOTHING;
