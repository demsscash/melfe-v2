/** @type {import('next').NextConfig} */
const nextConfig = {
   eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'wordpress-hwk484kwgs40k8cggw0ks0c4.45.159.222.88.sslip.io',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'wordpress-hwk484kwgs40k8cggw0ks0c4.45.159.222.88.sslip.io',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      // Autres domaines si nécessaire
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  },
  // Votre config CORS si vous l'avez ajoutée
  async rewrites() {
    return [
      {
        source: '/wp-api/:path*',
        destination: 'http://wordpress-hwk484kwgs40k8cggw0ks0c4.45.159.222.88.sslip.io/wp-json/:path*',
      },
    ];
  },
};

module.exports = nextConfig;