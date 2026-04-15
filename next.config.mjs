import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.EXPORT === "1" ? "export" : "standalone",
  basePath: process.env.BASE_PATH || undefined,
  env: {
    // 开发/生产环境标识，可在代码中用 process.env.NEXT_PUBLIC_APP_ENV 读取
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? "development",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default withNextIntl(nextConfig)
