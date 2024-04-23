/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    outputFileTracingIncludes: {
      "/login": [
        `./node_modules/argon2/prebuilds/${process.env.ARGON2_PREBUILDS_GLOB || "**"}`,
      ],
    },
  },
};

export default nextConfig;
