const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "nutribloghub.com",
          },
        ],
        destination: "https://www.nutribloghub.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;