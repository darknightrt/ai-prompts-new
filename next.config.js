/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 图像优化配置：允许加载 Unsplash 的图片资源
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '**',
      }
    ],
  },
};

module.exports = nextConfig;