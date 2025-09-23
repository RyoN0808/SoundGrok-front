/** @type {import('next').NextConfig} */
const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  'https://karaoke-linebot.onrender.com';

const nextConfig = {
  async rewrites() {
    return [
      // ふだんの API 呼び出し（フロントの /api/* → Render）
      { source: '/api/:path*', destination: `${BACKEND_ORIGIN}/:path*` },

      // LINE コールバック（/auth/* → Render）
      // ※ /api 下だと Next の予約ルートに阻まれて 404 になりやすい
      { source: '/auth/:path*', destination: `${BACKEND_ORIGIN}/auth/:path*` },
    ];
  },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
