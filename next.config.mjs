/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      hostname: 'localhost'
    }],
  },
  // Configuration to fix CSS loading issues
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  serverExternalPackages: [],
};

export default nextConfig;
