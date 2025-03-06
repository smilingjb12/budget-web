/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      hostname: 'localhost'
    }],
  },
  // Simplified configuration to fix CSS loading issues
  experimental: {
    // Keep only essential optimizations
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  serverExternalPackages: [],
  // Disable CSS optimization that might be causing issues
  //optimizeCss: false,
};

export default nextConfig;
