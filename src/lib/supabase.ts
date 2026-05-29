import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// 서버 전용 Supabase 클라이언트 (클라이언트 컴포넌트에서 직접 사용 금지)
// 빌드 타임 오류를 방지하기 위해 런타임에 초기화하는 Lazy 싱글톤
let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _client
}
