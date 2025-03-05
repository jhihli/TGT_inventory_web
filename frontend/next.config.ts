import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js modules on the client side
      config.resolve.fallback = {
        fs: false,
        os: false,
        path: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
