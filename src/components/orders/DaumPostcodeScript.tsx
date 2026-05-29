import Script from 'next/script'

// 카카오 우편번호 스크립트 전역 로드
export default function DaumPostcodeScript() {
  return (
    <Script
      src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
      strategy="lazyOnload"
    />
  )
}
