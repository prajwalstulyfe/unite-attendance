/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/api-client", "@repo/types", "@repo/utils"],
};

export default nextConfig;
