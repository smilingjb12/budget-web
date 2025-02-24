/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      hostname: process.env.NEXT_PUBLIC_CONVEX_URL?.replace('https://', '') || 'convex.dev'
    }],
  },
};

export default nextConfig;
