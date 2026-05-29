-- 주문 테이블 생성
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  address TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('접수', '확인중', '입금완료', '배송준비', '완료', '취소')),
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 등록
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 서버 사이드 전용 접근이므로 RLS 비활성화
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
