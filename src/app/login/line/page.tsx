'use client'

import { useEffect } from 'react'

export default function LineLogin() {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_LINE_CLIENT_ID
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_LINE_CALLBACK_URL || '')

    // ✅ セキュアなランダム state を生成
    const state = crypto.randomUUID()
    sessionStorage.setItem('line_login_state', state)

    const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid`

    window.location.href = lineAuthUrl
  }, [])

  return <p>Redirecting to LINE...</p>
}
