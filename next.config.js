/** @type {import('next').NextConfig} */
const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'https://karaoke-linebot.onrender.com';

const nextConfig = {
  // 本番ビルドで ESLint エラーを無視（必要なければ削除OK）
  eslint: {
    ignoreDuringBuilds: true,
  },

  // /api/* を Render(バックエンド) へリバースプロキシ
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${BACKEND_ORIGIN}/:path*` },
    ];
  },
};

module.exports = nextConfig;
