/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 1345054800,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "e8dae63f5d8f894c3457a80fdcbb7b60",
  },
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
  // Other Next.js configurations
};

module.exports = nextConfig;
